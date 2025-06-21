import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  getDashboardStats,
  getAllProducts,
  deleteProduct,
  getAllShops,
  getAllUsers,
  deleteUser,
  updateUser,
  updateShopownerSubscription
} from '../controllers/adminController.js';
import { getAllOrdersAdmin } from '../controllers/orderController.js';
import { 
  createMenuItem, 
  getAllMenuItems, 
  getMenuItemById,
  updateMenuItem, 
  deleteMenuItem,
  getMenuStats
} from '../controllers/menuController.js';

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
router.patch('/users/:id', updateUser);
router.patch('/users/:id/subscription', updateShopownerSubscription);

// Orders management
router.get('/orders', getAllOrdersAdmin);

// Menu management
router.post('/menu-items', createMenuItem);
router.get('/menu-items', getAllMenuItems);
router.get('/menu-items/:id', getMenuItemById);
router.put('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);
router.get('/menu-stats', getMenuStats);

export default router;
