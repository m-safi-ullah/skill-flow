import Profile from "../models/Profile.js";
import { verifyToken } from "../Controllers/generateToken.js";
import Stripe from "stripe";
import Order from "../models/Order.js";

// Place Order (COD)
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

// Create Stripe Checkout Session
export const createStripeSession = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { product, quantity, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session creation error:", err.message);
    return res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

// Save Order After Stripe Payment
export const stripePlaceOrder = async (req, res) => {
  try {
    const {
      title,
      price,
      productId,
      seller,
      buyer,
      phone,
      address,
      city,
      postalCode,
      additionalRequirements,
      quantity,
      isFile,
      paymentMethod,
    } = req.body;

    const orderData = {
      title,
      price,
      quantity,
      total: price * quantity,
      productId,
      seller,
      buyer,
      paymentMethod,
      paymentStatus: "paid",
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

    const newOrder = new Order(orderData);
    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Stripe order saved successfully!",
    });
  } catch (error) {
    console.error("Stripe Order Save Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving Stripe order.",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { isValid, decoded } = verifyToken(req, res);
    if (!isValid) return;

    const { email } = decoded;
    const orders = await Order.find({
      $or: [{ seller: email }, { buyer: email }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { isValid } = verifyToken(req, res);
    if (!isValid) return;

    const { orderId } = req.params;
    const { deliveryStatus } = req.body;
    const { paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
