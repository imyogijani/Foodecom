import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import { createOffer, getOffers, getShops, deleteOffer } from "../controllers/offerController.js";

const router = express.Router();

router.get("/admin/shops", authenticateToken, isAdmin, getShops);
router.get("/admin/offers", authenticateToken, isAdmin, getOffers);
router.post("/admin/offers", authenticateToken, isAdmin, createOffer);
router.delete("/admin/offers/:id", authenticateToken, isAdmin, deleteOffer);

// For home page (public)
router.get("/offers/today", getOffers);

export default router;
