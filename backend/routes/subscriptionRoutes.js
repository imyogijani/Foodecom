import express from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionByName,
} from "../controllers/subscriptionController.js";
const router = express.Router();

router.post("/subscriptions", createSubscription);
router.get("/subscriptions", getAllSubscriptions);
router.get("/subscriptions/:id", getSubscriptionById);
router.put("/subscriptions/:id", updateSubscription);
router.delete("/subscriptions/:id", deleteSubscription);
router.get("/plan-by-name/:planName", getSubscriptionByName);

export default router;

