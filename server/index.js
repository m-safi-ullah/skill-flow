import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./Routes/authRoute.js";
import dashboard from "./Routes/dashboard.js";
import searchProducts from "./Routes/search.js";
import order from "./Routes/order.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/auth", authRoute);
app.use("/dashboard", dashboard);
app.use("/uploads", express.static("uploads"));
app.use("/searchProducts", searchProducts);
app.use("/order", order);

mongoose
  .connect("mongodb://127.0.0.1:27017/skillFlow")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.listen(4400, () => {
  console.log("Server is running on port 4400");
});
