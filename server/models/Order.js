import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  productId: { type: String, required: true },
  seller: { type: String, required: true },
  buyer: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  additionalRequirements: { type: String },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: "cash" },
  paymentStatus: { type: String, default: "pending" },
  deliveryStatus: { type: String, default: "pending" },
});

const Order = mongoose.model("orders", OrderSchema);
export default Order;
