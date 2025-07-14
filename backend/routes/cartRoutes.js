// routes/cartRoutes.js
import express from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getUserCart);
router.post("/remove", removeFromCart);
router.post("/update", updateCartQuantity);
router.delete("/clear/:userId", clearCart);

export default router;
