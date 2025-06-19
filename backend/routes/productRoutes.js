import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Add new product
router.post("/add", authenticateToken, addProduct);

// Get seller's products
router.get("/seller-products", authenticateToken, getSellerProducts);

// Update product
router.put("/:productId", authenticateToken, updateProduct);

// Get all products
router.get("/", getAllProducts);

// Delete product
router.delete("/:productId", authenticateToken, deleteProduct);

export default router;
