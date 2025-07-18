// routes/storeRoutes.js
import express from "express";
import { getAllStores } from "../controllers/storeController.js";

const router = express.Router();

// GET /api/stores
router.get("/", getAllStores);

export default router;
