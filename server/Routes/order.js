import express from "express";
import {
  placeOrder,
  createStripeSession,
  stripePlaceOrder,
  getOrders,
  updateOrderStatus,
} from "../Controllers/order.js";
const router = express.Router();

router.post("/place-order", placeOrder);
router.post("/create-stripe-session", createStripeSession);
router.post("/stripe-place-order", stripePlaceOrder);
router.get("/get-orders", getOrders);
router.patch("/update/:orderId", updateOrderStatus);

export default router;
