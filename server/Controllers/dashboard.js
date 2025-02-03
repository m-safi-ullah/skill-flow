import ProfileModel from "../models/profile.js";
import { verifyToken } from "./generateToken.js";

export const setProfile = async (req, res) => {
  const { name, email, address, about, skills } = req.body;
  if (!verifyToken(req, res)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const profile = await ProfileModel({
      name: name,
      email: email,
      address: address,
      about: about,
      skills: skills,
    });
    await profile.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error(error);
  }
};
