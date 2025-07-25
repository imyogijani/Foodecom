import express from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionByName,
} from "../controllers/subscriptionController.js";
import {
  authenticateToken,
  authorizeAdmin,
  isAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/subscriptions", getAllSubscriptions);

router.use(authenticateToken, authorizeAdmin, isAdmin);

router.post("/subscriptions", createSubscription);
router.get("/subscriptions/:id", getSubscriptionById);
router.put("/subscriptions/:id", updateSubscription);
router.delete("/subscriptions/:id", deleteSubscription);
router.get("/plan-by-name/:planName", getSubscriptionByName);

export default router;
