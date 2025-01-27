import express from "express";
import multer from "multer";
import {
  signIn,
  register,
  verifyOtp,
  sellerRegister,
} from "../Controllers/auth.js";

import { verifyToken } from "../Controllers/generateToken.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 500KB limit!" });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

router.post("/signIn", signIn);
router.post("/register", register);
router.post(
  "/seller-register",
  upload.single("attachCnic"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "File is required!" });
    }
    if (req.file.size > 500 * 1024) {
      return res.status(400).json({ error: "File size exceeds 500KB limit!" });
    }
    next();
  },
  sellerRegister,
  multerErrorHandler
);
router.post("/verifyOtp", verifyOtp);
router.post("/verify-token", verifyToken);

export default router;
