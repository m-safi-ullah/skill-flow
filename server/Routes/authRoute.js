import express from "express";
import multer from "multer";
import {
  signIn,
  register,
  verifyOtp,
  sellerRegister,
  verifyEmail,
  adminRegister,
  setNewPasswod,
  updatePassword,
} from "../Controllers/auth.js";

import { verifyToken } from "../Controllers/generateToken.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cnic");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 2048 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.post("/signIn", signIn);
router.post("/register", register);
router.post("/admin-register", upload.single("attachCnic"), adminRegister);
router.post("/seller-register", upload.single("attachCnic"), sellerRegister);
router.post("/verify-otp", verifyOtp);
router.post("/verify-token", verifyToken);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", setNewPasswod);
router.post("/update-password", updatePassword);
export default router;
