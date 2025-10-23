// File: backend/controllers/orderController.js

import orderModel from '../Models/orderModel.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getFullImageUrl = (imagePath) => {
  const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  // सुनिश्चित करें कि यह /uploads/ से शुरू हो
  const finalPath = cleanPath.startsWith('/uploads') ? cleanPath : `/uploads${cleanPath}`;
  return `${API_URL}${finalPath}`;
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
      email: addressDetails.email,
      firstName: addressDetails.firstName,
      lastName: addressDetails.lastName,
      phone: addressDetails.phone,
      address: addressDetails.address,
      city: addressDetails.city,
      zipCode: addressDetails.zipCode,
      items: orderItems,
      total: Number(total),
      tax: Number(tax),
      subtotal: Number(subtotal),
      paymentMethod,
    });

    if (paymentMethod === 'cod') {
      newOrder.paymentStatus = 'succeeded';
    }

    await newOrder.save();

    if (paymentMethod === 'online') {
      const lineItems = orderItems.map(o => ({
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
        success_url: `${frontendUrl}/myorder/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontendUrl}/myorder/verify?success=false&orderId=${newOrder._id}`,
        metadata: { orderId: newOrder._id.toString() },
      });

      newOrder.sessionId = session.id;
      await newOrder.save(); // Session ID सेव करने के लिए दोबारा सेव करें

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
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// Admin: Get All Orders - FIX for 500 Internal Server Error
const getAllOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    // ✅ FIX: 'name' के बजाय 'username' का उपयोग किया गया
    const orders = await orderModel.find({})
        .populate('user', 'username email phone') 
        .sort({ createdAt: -1 });
    
    // Admin frontend expects an array directly
    res.json(orders); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error fetching all orders' });
  }
};


// Admin: Update Order Status
const updateOrderAdmin = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const orderId = req.params.id;
    const { status } = req.body;

    const updateFields = { status };
    if (status === 'delivered') {
      updateFields.deliveredAt = new Date();
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updateFields, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Status Updated', order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const update = req.body;
    const order = await orderModel.findById(orderId);

    if (!order || order.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ success: false, message: 'Order not found or access denied' });
    }

    if (update.status === 'cancelled' && !update.cancellationReason) {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required when cancelling an order' });
    }

    if (update.status === 'cancelled') {
        order.status = 'cancelled';
        order.cancellationReason = update.cancellationReason;
        await order.save();
        return res.json({ success: true, message: 'Order cancelled successfully' });
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

    // Check Stripe session status
    if (order.sessionId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(order.sessionId);
      if (session.payment_status === 'paid') {
          order.paymentStatus = 'succeeded';
          order.status = 'processing';
          order.transactionId = session.payment_intent;
          await order.save();
          return res.json({ success: true, message: 'Payment confirmed successfully' });
      }
    }


    // Fallback for COD/Unsuccessful online payments
    if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'succeeded';
        order.status = 'processing';
        await order.save();
        return res.json({ success: true, message: 'Payment confirmed successfully (COD/Fallback)' });
    }

    res.status(400).json({ success: false, message: 'Payment not yet succeeded' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error confirming payment' });
  }
};


export { createOrder, getOrders, getAllOrders, updateOrderAdmin, confirmPayment, getOrderById, updateOrder };