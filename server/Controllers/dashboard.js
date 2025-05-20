import AuthModel from "../models/authDB.js";
import ProfileModel from "../models/Profile.js";
import Products from "../models/Product.js";
import { verifyToken } from "../Controllers/generateToken.js";
import Portfolios from "../models/Portfolios.js";

// Profile Functions
export const setProfile = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role } = decoded;
    const { name, address, phone, about, skills } = req.body;
    if (!email || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Email and role are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await ProfileModel.findOne({ email: normalizedEmail, role });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.name = name;
    user.phone = phone;
    user.address = address;
    user.about = about;
    user.skills = skills;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getProfile = async (req, res) => {
  try {
    let profile;
    let normalizedEmail = "";
    let role = "";
    let name = "";

    if (req.query.portal && req.query.name) {
      const { name, portal } = req.query;
      role = portal;

      profile = await ProfileModel.findOne({
        role,
        username: name,
      });

      if (profile) {
        return res.status(200).json({ success: true, profile });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found." });
      }
    } else {
      const { isValid, decoded } = verifyToken(req, res);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { email, role: decodedRole, name: decodedName } = decoded;
      normalizedEmail = email.trim().toLowerCase();
      role = decodedRole;
      name = decodedName;

      profile = await ProfileModel.findOne({
        email: normalizedEmail,
        role,
      });

      if (profile) {
        return res.status(200).json({ success: true, profile });
      }

      const newProfile = new ProfileModel({
        profilePic: "",
        name: name || "",
        email: normalizedEmail,
        username: normalizedEmail,
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role } = decoded;
    const { username } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Username is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await ProfileModel.findOne({
      email: normalizedEmail,
      role,
    });

    const existingUser = await ProfileModel.findOne({
      username,
      email: { $ne: normalizedEmail },
      // role: { $ne: role },
    });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Username not avaialble.",
        profile: user,
      });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.username = username;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Username updated successfully.",
      profile: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// export const getProfile = async (req, res) => {
//   try {
//     const { isValid, decoded } = verifyToken(req, res);
//     if (!isValid) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { email, role, name } = decoded;
//     const normalizedEmail = email.trim().toLowerCase();
//     const profile = await ProfileModel.findOne({
//       email: normalizedEmail,
//       role,
//     });

//     if (profile) {
//       return res.status(200).json({ success: true, profile });
//     }

//     const newProfile = new ProfileModel({
//       profilePic: "",
//       name: name || "",
//       email: normalizedEmail,
//       role: role || "",
//       phone: "",
//       address: "",
//       about: "",
//       skills: "",
//     });

//     await newProfile.save();
//     return res.status(200).json({ success: true, profile: newProfile });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error." });
//   }
// };

export const getUserList = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { list } = req.query;
    const users = await AuthModel.find({ role: list });
    const userList = users.map((user) => ({
      name: user.name,
      email: user.email,
    }));

    return res.status(200).json({ success: true, userList });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role } = decoded;
    await AuthModel.findOneAndDelete({ email, role });
    await ProfileModel.findOneAndDelete({ email, role });
    return res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Product Functions

export const addProduct = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, role, id } = decoded;
    const { title, price, description, shortDescription, isFile, tags } =
      req.body;

    let imagePaths = [];
    if (req.files && Array.isArray(req.files)) {
      imagePaths = req.files.map((file) => file.path);
    }

    const newItem = new Products({
      profileId: id || null,
      email,
      role,
      title,
      price,
      isFile,
      shortDescription,
      description,
      tags,
      image: imagePaths,
    });

    await newItem.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the item.",
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    let products;

    if (req.query.name && req.query.portal) {
      const { name, portal } = req.query;

      const profile = await ProfileModel.findOne({ username: name });

      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }

      const email = profile.email;

      products = await Products.find({ role: portal, email }).exec();
    } else {
      const { isValid, decoded } = verifyToken(req, res);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { email, role } = decoded;
      products = await Products.find({ email, role });
      const profileData = await ProfileModel.findOne({ email, role });
      products = products.map((product) => ({
        ...product.toObject(),
        username: profileData?.username,
      }));
    }

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getProductById = async (req, res) => {
  try {
    let product;
    const { id } = req.query;
    const { isValid, decoded } = verifyToken(req, res);

    if (id && !isValid) {
      product = await Products.findOne({ _id: id });
      return res.status(200).json({ success: true, product });
    } else if (id && isValid) {
      product = await Products.findOne({ _id: id });
      return res.status(200).json({ success: true, product });
    } else {
      const { email } = decoded;
      product = await Products.findOne({ _id: id, email });
      return res.status(200).json({ success: true, product });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || (decoded.role !== "admin" && decoded.role !== "seller")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.query;
    await Products.findOneAndDelete({ _id: productId });
    return res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      title,
      price,
      description,
      isFile,
      shortDescription,
      tags,
      deletedImages = "[]",
    } = req.body;
    const { id } = req.params;
    const { email } = decoded;

    // Fetch existing product
    const existingProduct = await Products.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (existingProduct.email !== email) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Remove deleted images
    const deletedList = JSON.parse(deletedImages);
    let imagePaths = (existingProduct.image || []).filter(
      (imgPath) => !deletedList.includes(imgPath)
    );

    // Add new uploaded images
    if (req.files && Array.isArray(req.files)) {
      const newImagePaths = req.files.map((file) => file.path);
      imagePaths.push(...newImagePaths);
    }

    // Remove duplicates (optional safety)
    imagePaths = [...new Set(imagePaths)];

    // Update fields
    existingProduct.title = title;
    existingProduct.price = price;
    existingProduct.isFile = isFile;
    existingProduct.description = description;
    existingProduct.shortDescription = shortDescription;
    existingProduct.tags = tags;
    existingProduct.image = imagePaths;

    await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the product.",
    });
  }
};

// Portfolio Functions

export const addPortfolio = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email, id } = decoded;
    const { title, price, description, tags } = req.body;

    const newItem = new Portfolios({
      profileId: id,
      email,
      title,
      price,
      description,
      tags,
      image: req.file ? req.file.path : [],
    });

    await newItem.save();
    return res
      .status(201)
      .json({ success: true, message: "Product created successfully!" });
  } catch (error) {
    console.error("Error creating item:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the item.",
    });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    let products;

    if (req.query.name) {
      const { name } = req.query;
      const profile = await ProfileModel.findOne({ username: name });

      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }
      const email = profile.email;
      products = await Portfolios.find({ email });
    } else {
      const { isValid, decoded } = verifyToken(req, res);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { email } = decoded;
      products = await Portfolios.find({ email });
    }

    // Return the filtered portfolio
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, price, description, tags, existingImage } = req.body;
    const { id } = req.params;
    const { email } = decoded;

    const existingPortfolio = await Portfolios.findOne({ _id: id, email });
    if (!existingPortfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }

    const updatedImage =
      req.file?.path || existingImage || existingPortfolio.image;

    existingPortfolio.title = title;
    existingPortfolio.price = price;
    existingPortfolio.description = description;
    existingPortfolio.tags = tags;
    existingPortfolio.image = updatedImage;

    await existingPortfolio.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully!",
      product: existingPortfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the portfolio.",
    });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid || decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.query;
    await Portfolios.findOneAndDelete({ _id: id });
    return res
      .status(200)
      .json({ success: true, message: "Porfolio Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
