import orderModel from '../Models/orderModel.js'
import userModel from '../Models/userModel.js'
import mongoose from 'mongoose'
import Stripe from 'stripe'

// Setting up Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to validate and format image URLs
const getFullImageUrl = (imagePath) => {
  const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${cleanPath}`;
};

// Placing an order from the user
const createOrder = async (req, res) => {
  try {
    const { items, total, tax, subtotal, ...addressDetails } = req.body;
    const userId = req.user.id;

    // Ensure items is an array
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid items format' });
    }

    // Map items to the correct structure for the order model
    const orderItems = items.map(o => {
      return {
        item: {
          _id: mongoose.Types.ObjectId.isValid(o.item._id) ? o.item._id : new mongoose.Types.ObjectId(),
          name: o.item.name,
          price: Number(o.item.price),
          imageUrl: getFullImageUrl(o.item.imageUrl),
        },
        quantity: Number(o.quantity)
      };
    });

    const newOrder = new orderModel({
      user: userId,
      items: orderItems,
      total: Number(total),
      tax: Number(tax),
      subtotal: Number(subtotal),
      ...addressDetails
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const lineItems = items.map(o => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: o.item.name,
          images: [getFullImageUrl(o.item.imageUrl)],
        },
        unit_amount: Math.round(o.item.price * 100)
      },
      quantity: o.quantity
    }));

    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: 50 * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VITE_FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching all orders' });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error updating status' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const update = req.body;
    await orderModel.findByIdAndUpdate(orderId, update);
    res.json({ success: true, message: 'Order Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating order' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error fetching order by ID' });
  }
};

const updateAnyOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const update = req.body;
    await orderModel.findByIdAndUpdate(orderId, update);
    res.json({ success: true, message: 'Order Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating order for admin' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Missing session_id' });
    }

    // Update order payment status to succeeded/completed
    await orderModel.findByIdAndUpdate(sessionId, { paymentStatus: 'succeeded', status: 'completed' });

    res.json({ success: true, message: 'Payment confirmed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error confirming payment' });
  }
};


export { createOrder, getOrders, getAllOrders, updateStatus, confirmPayment, getOrderById, updateAnyOrder, updateOrder };