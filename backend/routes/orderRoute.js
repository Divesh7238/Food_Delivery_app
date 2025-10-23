// File: backend/routes/orderRoute.js

import express from 'express';
import {
  confirmPayment,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  updateOrderAdmin, // ✅ FIX: updateOrderAdmin इंपोर्ट किया
  updateOrder 
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Middleware to authenticate all routes in this router
orderRouter.use(authMiddleware);

// Admin Routes (Admin-specific access and logic)
// ऑर्डर्स Fetch करने के लिए: http://localhost:4000/api/orders/all
orderRouter.get('/all', getAllOrders); 
// ऑर्डर स्टेटस अपडेट करने के लिए: http://localhost:4000/api/orders/admin/:id
orderRouter.put('/admin/:id', updateOrderAdmin); 

// User Routes
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders); // User-specific orders fetch

// Payment & Confirmation
orderRouter.post('/confirm', confirmPayment);
orderRouter.get('/:id', getOrderById);
// User-side route for cancelling/updating their own order
orderRouter.put('/:id', updateOrder); 

export default orderRouter;