import express from "express";
import {
  initiatePayment,
  paymentWebhook,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/initiate", protect, initiatePayment);
router.post("/webhook", paymentWebhook);
export default router;
