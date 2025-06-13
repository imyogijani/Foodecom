import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  getDashboardStats,
  getAllProducts,
  deleteProduct,
  getAllShops,
  getAllUsers,
  deleteUser,
  updateUserRole
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);
router.use(authorizeAdmin);

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// Products management
router.get('/all-products', getAllProducts);
router.delete('/products/:id', deleteProduct);

// Shops management
router.get('/shops', getAllShops);

// Users management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);

export default router;
