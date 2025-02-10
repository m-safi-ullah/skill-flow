import express from "express";
import {
  setProfile,
  getProfile,
  getUserList,
  deleteUser,
  addProduct,
} from "../Controllers/dashboard.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePic");
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

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 5MB limit!" });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

const router = express.Router();
router.post(
  "/setProfile",
  upload.single("profilePic"),
  (req, res, next) => {
    next();
  },
  setProfile,
  multerErrorHandler
);
router.get("/getProfile", getProfile);
router.get("/getUserList", getUserList);
router.get("/deleteUser", deleteUser);

router.post(
  "/create-product",
  upload.single("profilePic"),
  addProduct,
  multerErrorHandler
);
export default router;
