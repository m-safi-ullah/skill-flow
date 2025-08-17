import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/authRoute.js";
import dashboard from "./Routes/dashboard.js";
import searchProducts from "./Routes/search.js";
import order from "./Routes/order.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "https://skill-flow-frontend.onrender.com", credentials: true }));

// Routes
app.use("/auth", authRoute);
app.use("/dashboard", dashboard);
app.use("/uploads", express.static("uploads"));
app.use("/searchProducts", searchProducts);
app.use("/order", order);

const connectToMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/skillFlow");
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  } else {
    console.log("MongoDB already connected");
  }
};

connectToMongoDB();

app.listen(4400, () => {
  console.log("Server is running on port 4400");
});
