import AuthModel from "../models/authDB.js";
import ProfileModel from "../models/profile.js";

export const setProfile = async (req, res) => {
  const { name, email, role, address, phone, about, skills } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    let user = await ProfileModel.findOne({ email: normalizedEmail, role });
    user.name = name;
    user.phone = phone;
    user.role = role;
    user.address = address;
    user.about = about;
    user.skills = skills;
    if (req.file) {
      user.profilePic = req.file.path;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getProfile = async (req, res) => {
  const { name, email, role } = req.query;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const profile = await ProfileModel.findOne({
      email: normalizedEmail,
      role,
    });
    if (profile) {
      res.status(200).json({ success: true, profile });
    } else {
      const newProfile = new ProfileModel({
        profilePic: "",
        name: name || "",
        email: normalizedEmail,
        role: role || "",
        phone: "",
        address: "",
        about: "",
        skills: "",
      });

      await newProfile.save();
      return res.status(200).json({ success: true, profile: newProfile });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getUserList = async (req, res) => {
  try {
    const { list } = req.query;
    console.log(list);
    const users = await AuthModel.find({ role: list });
    const userList = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
      };
    });
    res.status(200).json({ success: true, userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email, role } = req.query;
    await AuthModel.findOneAndDelete({ email, role });
    await ProfileModel.findOneAndDelete({ email, role });
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const addProduct = async (req, res) => {
  const { email, role, title, price, description, tags } = req.query;

  // Prepare image paths
  try {
    const imagePaths = {};
    if (req.files) {
      if (req.files.image1) imagePaths.image1 = req.files.image1[0].path;
      if (req.files.image2) imagePaths.image2 = req.files.image2[0].path;
      if (req.files.image3) imagePaths.image3 = req.files.image3[0].path;
    }

    // Create new item
    const newItem = new Item({
      email,
      role,
      title,
      price: parseFloat(price),
      description,
      tags: tags,
      images: imagePaths,
    });

    // Save item to database
    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the item.",
    });
  }
};
