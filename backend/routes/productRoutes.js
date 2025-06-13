import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Add new product
router.post('/add', authenticateToken, addProduct);

// Get seller's products
router.get('/seller-products', authenticateToken, getSellerProducts);

// Update product
router.put('/:productId', authenticateToken, updateProduct);

// Delete product
router.delete('/:productId', authenticateToken, deleteProduct);

export default router;
