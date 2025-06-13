import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

// Get user's orders
router.get('/user-orders', authenticateToken, getUserOrders);

export default router;
