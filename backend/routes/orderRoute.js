import express from 'express';
import {
  confirmPayment,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  updateAnyOrder,
  updateOrder
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// PUBLIC ADMIN ROUTES
orderRouter.get('/getall', getAllOrders);
orderRouter.put('/admin/:id', updateAnyOrder);

// PROTECT THE REST USING MIDDLEWARE
orderRouter.use(authMiddleware);


orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/confirm', confirmPayment);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);

export default orderRouter;
