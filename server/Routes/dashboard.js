import express from "express";
import multer from "multer";
import {
  setProfile,
  getProfile,
  getUserList,
  deleteUser,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  addPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  updateUsername,
  deleteAccount,
} from "../Controllers/dashboard.js";

import { test } from "../Controllers/test.js";

const createMulterConfig = (destination) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, destination),
      filename: (req, file, cb) =>
        cb(null, `${Date.now()}-${file.originalname}`),
    }),
    limits: { fileSize: 2 * 1024 * 1000 },
    fileFilter: (req, file, cb) =>
      file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Only image files are allowed!"), false),
  });

const profilePic = createMulterConfig("uploads/profilePic");
const productUpload = createMulterConfig("uploads/productPic");
const portfolioUpload = createMulterConfig("uploads/portfolioPic");

const multerErrorHandler = (err, req, res, next) =>
  err ? res.status(400).json({ error: err.message }) : next();

const router = express.Router();

// profile routes
router.post(
  "/setProfile",
  profilePic.single("profilePic"),
  setProfile,
  multerErrorHandler
);

router.get("/getProfile", getProfile);
router.get("/getUserList", getUserList);
router.get("/deleteUser", deleteUser);

router.post("/updateUsername", updateUsername);

// Product routes
router.post(
  "/createProduct",
  productUpload.array("images[]", 4),
  addProduct,
  multerErrorHandler
);

router.patch(
  "/updateProduct/:id",
  productUpload.array("images[]", 4),
  updateProduct
);

router.get("/getProduct", getProduct);
router.get("/getProductById", getProductById);
router.delete("/deleteProduct", deleteProduct);

// Portfolio routes
router.post(
  "/portfolioTab",
  portfolioUpload.single("image"),
  addPortfolio,
  multerErrorHandler
);

router.get("/getPortfolio", getPortfolio);

router.patch(
  "/updatePortfolio/:id",
  portfolioUpload.single("image"),
  updatePortfolio
);

router.delete("/deletePortfolio", deletePortfolio);

router.post("/test", test);

router.delete("/delete-account", deleteAccount);

export default router;
