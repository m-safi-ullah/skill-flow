import { verifyToken } from "./generateToken.js";
import ProfileModel from "../models/Profile.js";
export const test = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid && decoded.email != "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role } = decoded;
    const { score, reason } = req.body;

    const date = new Date().toISOString();

    const normalizedEmail = email.trim().toLowerCase();
    const user = await ProfileModel.findOne({ email: normalizedEmail, role });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (score) {
      user.test.score = score;
      user.test.date = date;
    }

    if (reason) {
      user.test.date = date;
      user.test.voilation = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Test record updated successfully.",
      profile: user,
    });
  } catch (error) {
    console.error("addskill error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
