import orderModel from '../models/orderModel.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getFullImageUrl = (imagePath) => {
  const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${cleanPath}`;
};

const createOrder = async (req, res) => {
  try {
    const { items, total, tax, subtotal, paymentMethod, ...addressDetails } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid items format' });
    }

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
      paymentMethod,
      ...addressDetails
    });

    if (paymentMethod === 'cod') {
      newOrder.paymentStatus = 'succeeded';
    }

    await newOrder.save();

    if (paymentMethod === 'online') {
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

      const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        metadata: { orderId: newOrder._id.toString() },
      });

      res.json({ success: true, checkoutUrl: session.url });
    } else {
      res.json({ success: true, order: newOrder });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Error creating order' });
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
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const orders = await orderModel.find({}).populate('user', 'name phone email');
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

    // Optional: Validate cancellation reason if status is cancelled
    if (update.status === 'cancelled' && !update.cancellationReason) {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required when cancelling an order' });
    }

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
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const orderId = req.params.id;
    const update = req.body;
    await orderModel.findByIdAndUpdate(orderId, update);
    res.json({ success: true, message: 'Order Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating order' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Missing orderId' });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'succeeded';
    order.status = 'processing';
    await order.save();

    res.json({ success: true, message: 'Payment confirmed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error confirming payment' });
  }
};

export { createOrder, getOrders, getAllOrders, updateStatus, confirmPayment, getOrderById, updateAnyOrder, updateOrder };