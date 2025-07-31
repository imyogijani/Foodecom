import express from "express";
import {
  authenticateToken,
  customerOnly,
  fetchUser,
} from "../middlewares/authMiddleware.js";
import {
  getUserOrders,
  createOrder,
  getOrderById,
  getAllOrdersAdmin,
  getOrderTimeline,
  getSellerOrderHistory,
} from "../controllers/orderController.js";

const router = express.Router();

// Get user's orders
router.get("/user-orders", authenticateToken, getUserOrders);
router.get("/user-orders", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);
router.get("/:orderId/timeline", authenticateToken, getOrderTimeline);
router.get("/:orderId/timeline", authenticateToken, getOrderTimeline);
router.get("/orders/history", authenticateToken, getSellerOrderHistory);

// Create a new order (checkout) - only customers allowed
router.post("/create", authenticateToken, fetchUser, createOrder);

export default router;
