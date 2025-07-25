import express from "express";
import {
  createDeal,
  approveDeal,
  rejectDeal,
  endDeal,
  getAllDeals,
  getSellerDeals,
  // getActiveDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getFilteredDeals,
} from "../controllers/dealController.js";
import { authenticateToken, fetchUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getFilteredDeals); // New

// Seller routes
router.use(authenticateToken, fetchUser); // All routes below require authentication

// Seller deal management
router.post("/create", createDeal);
router.get("/seller", getSellerDeals); // New -- seller?status=approved this use only status approved show
router.patch("/:dealId", updateDeal);  // New 
router.delete("/:dealId", deleteDeal);  
router.post("/:dealId/end", endDeal);

// Admin routes
router.get("/admin/all", getAllDeals);
router.post("/admin/:dealId/approve", approveDeal);
router.post("/admin/:dealId/reject", rejectDeal);

// Common routes
router.get("/:dealId", getDealById);

export default router;
