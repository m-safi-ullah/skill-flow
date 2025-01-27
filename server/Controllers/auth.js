import AuthModel from "../models/authDB.js";
import TempUser from "../models/tempUser.js";
import { sendVerificationCode } from "../mail/email.js";
import bcrypt from "bcrypt";
import { generateToken } from "./generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const role = "buyer";

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await AuthModel.findOne({
      email: normalizedEmail,
      role,
    });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    let tempUser = await TempUser.findOne({ email: normalizedEmail });

    if (tempUser) {
      tempUser.name = name;
      tempUser.password = hashedPassword;
      tempUser.verificationCode = verificationCode;
      tempUser.role = role;
      tempUser.codeExpiresAt = codeExpiresAt;

      await tempUser.save();
      sendVerificationCode(normalizedEmail, verificationCode);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. User updated.",
      });
    }

    tempUser = await TempUser.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode,
      role,
      codeExpiresAt,
    });

    sendVerificationCode(normalizedEmail, verificationCode);

    res.status(200).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const tempUser = await TempUser.findOne({ email: normalizedEmail });
    if (!tempUser) {
      return res.status(200).json({
        success: false,
        message: "No verification code found for this email.",
      });
    }

    if (
      tempUser.verificationCode !== otp ||
      tempUser.codeExpiresAt < Date.now()
    ) {
      return res.status(200).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    const user = new AuthModel({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      cnic: tempUser.cnic || "",
      attachCnic: tempUser.attachCnic || "",
    });
    await user.save();

    await TempUser.deleteOne({ email: normalizedEmail });

    generateToken(user, res);

    res.status(200).json({
      success: true,
      message: "Email verified and account activated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await AuthModel.findOne({ email: normalizedEmail, role });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password or select correct role",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    generateToken(user, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed due to a server error",
      error: error.message,
    });
  }
};

export const sellerRegister = async (req, res) => {
  const { name, email, cnic, password } = req.body;
  const role = "seller";
  const attachCnic = req.file;

  if (!attachCnic || !attachCnic.path) {
    return res.status(400).json({ error: "Company image is required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await AuthModel.findOne({
      email: normalizedEmail,
      role,
    });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    let tempUser = await TempUser.findOne({ email: normalizedEmail });

    if (tempUser) {
      tempUser.name = name;
      tempUser.cnic = cnic;
      tempUser.password = hashedPassword;
      tempUser.verificationCode = verificationCode;
      tempUser.role = role;
      tempUser.codeExpiresAt = codeExpiresAt;

      if (attachCnic) {
        tempUser.attachCnic = attachCnic?.path;
      }

      await tempUser.save();
      sendVerificationCode(normalizedEmail, verificationCode);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. User updated.",
      });
    }

    tempUser = await TempUser.create({
      name,
      email: normalizedEmail,
      cnic,
      password: hashedPassword,
      verificationCode,
      role,
      codeExpiresAt,
      attachCnic: attachCnic ? attachCnic.path : null,
    });

    sendVerificationCode(normalizedEmail, verificationCode);

    res.status(200).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};
