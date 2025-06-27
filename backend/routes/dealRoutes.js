import express from "express";
import {
  createDeal,
  approveDeal,
  rejectDeal,
  endDeal,
  getAllDeals,
  getSellerDeals,
  getActiveDeals,
  getDealById,
  updateDeal,
  deleteDeal,
} from "../controllers/dealController.js";
import { authenticateToken, fetchUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveDeals);

// Seller routes
router.use(authenticateToken, fetchUser); // All routes below require authentication

// Seller deal management
router.post("/create", createDeal);
router.get("/seller", getSellerDeals);
router.put("/:dealId", updateDeal);
router.delete("/:dealId", deleteDeal);
router.post("/:dealId/end", endDeal);

// Admin routes
router.get("/admin/all", getAllDeals);
router.post("/admin/:dealId/approve", approveDeal);
router.post("/admin/:dealId/reject", rejectDeal);

// Common routes
router.get("/:dealId", getDealById);

export default router;
