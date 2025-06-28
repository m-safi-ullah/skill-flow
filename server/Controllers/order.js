import { verifyToken } from "../Controllers/generateToken.js";
import Order from "../models/Order.js";
import Profile from "../models/Profile.js";

export const placeOrder = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid) return;

    const { email } = decoded;
    const {
      id,
      title,
      price,
      username,
      isFile,
      phone,
      address,
      city,
      postalCode,
      additionalRequirements,
      quantity,
      paymentMethod,
    } = req.body;

    const seller = await Profile.findOne({ username });
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found." });
    }

    if (seller.email === email) {
      return res.status(400).json({
        success: false,
        message: "You cannot place an order on your own product.",
      });
    }

    const orderData = {
      title,
      price,
      quantity,
      total: price * quantity,
      productId: id,
      seller: seller.email,
      buyer: email,
      paymentMethod,
    };

    if (isFile === "true" || isFile === true) {
      orderData.additionalRequirements = additionalRequirements;
    } else {
      orderData.phone = phone;
      orderData.address = address;
      orderData.city = city;
      orderData.postalCode = postalCode;
      orderData.additionalRequirements = additionalRequirements;
    }

    const createOrder = new Order(orderData);
    await createOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
