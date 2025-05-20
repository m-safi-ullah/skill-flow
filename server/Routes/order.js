import express from "express";
import { placeOrder } from "../Controllers/order.js";
const router = express.Router();

router.post("/place-order", placeOrder);

export default router;
