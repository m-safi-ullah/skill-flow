import AuthModel from "../models/authDB.js";
import TempUser from "../models/tempUser.js";
import { sendVerificationCode, sendVerifyEmail } from "../mail/email.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "./generateToken.js";

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
    const codeExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

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

export const adminRegister = async (req, res) => {
  const { name, email, cnic, password } = req.body;
  const role = "admin";
  const attachCnic = req.file;

  if (!attachCnic || !attachCnic.path) {
    return res.status(400).json({ error: "Company image is required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await AuthModel.findOne({
      $and: [
        { email: normalizedEmail },
        { role: role },
        {
          $or: [{ cnic }, { email: normalizedEmail, role: role }],
        },
      ],
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
        message: "OTP sent successfully.",
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
    if (tempUser.role !== "admin") {
      generateToken(user, res);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
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

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if CNIC is already registered
    const existingCnicUser = await AuthModel.findOne({ cnic, role });

    if (existingCnicUser) {
      return res.status(200).json({
        success: false,
        message: "Account already registered with entered CNIC",
      });
    }

    // Check if email is already registered
    const existingEmailUser = await AuthModel.findOne({
      email: normalizedEmail,
      role,
    });

    if (existingEmailUser) {
      return res.status(200).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Expires in 24 hours

    let tempUser = await TempUser.findOne({ email: normalizedEmail });

    if (tempUser) {
      tempUser.name = name;
      tempUser.cnic = cnic;
      tempUser.password = hashedPassword;
      tempUser.verificationCode = verificationCode;
      tempUser.role = role;
      tempUser.codeExpiresAt = codeExpiresAt;

      if (attachCnic) {
        tempUser.attachCnic = attachCnic.path;
      }

      await tempUser.save();
      sendVerificationCode(normalizedEmail, verificationCode);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
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

    return res.status(200).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await AuthModel.findOne({ email: normalizedEmail, role });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Invalid email or role",
    });
  } else {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await TempUser.create({
      email: normalizedEmail,
      verificationCode,
      role,
      createdAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    sendVerifyEmail(normalizedEmail, verificationCode);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  }
};

export const setNewPasswod = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await AuthModel.findOne({ email: normalizedEmail, role });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Invalid email or role",
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    generateToken(user, res);
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role } = decoded;
    const { password, newpassword } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Find user by email & role (without password in query)
    const user = await AuthModel.findOne({ email: normalizedEmail, role });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare the provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid current password",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    // Generate new token (if needed)
    generateToken(user, res);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password.",
    });
  }
};
