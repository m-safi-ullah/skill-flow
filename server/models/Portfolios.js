import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profiles",
    required: true,
  },
  email: String,
  title: String,
  description: String,
  price: String,
  tags: String,
  image: Array,
});

const productModel = mongoose.model("portfolios", portfolioSchema);
export default productModel;
