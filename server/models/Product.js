import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  email: String,
  role: String,
  title: String,
  description: String,
  price: String,
  tags: String,
  image: Array,
});

const productModel = mongoose.model("product", productSchema);
export default productModel;
