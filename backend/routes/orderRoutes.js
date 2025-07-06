import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getUserOrders, createOrder } from '../controllers/orderController.js';

const router = express.Router();

// Get user's orders
router.get('/user-orders', authenticateToken, getUserOrders);

// Create a new order
router.post('/create', authenticateToken, createOrder);



export default router;
