import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profiles",
    required: true,
  },
  email: String,
  role: String,
  title: String,
  shortDescription: String,
  isFile: Boolean,
  description: String,
  price: String,
  tags: String,
  image: Array,
});

const productModel = mongoose.model("product", productSchema);
export default productModel;
