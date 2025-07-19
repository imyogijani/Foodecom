// routes/storeRoutes.js
import express from "express";
import {
  getAllStores,
  getSingleStore,
} from "../controllers/storeController.js";

const router = express.Router();

// GET /api/stores
router.get("/", getAllStores);
router.get("/sellers/:id", getSingleStore); // SellerId

export default router;
