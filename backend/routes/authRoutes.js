import express from "express";
import {
  registerController,
  loginController,
  currentuserConroller,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes
// Register || POST
router.post("/register", registerController);

// Login || POST
router.post("/login", loginController);

// Get current user || GET
router.get("/current-user", authMiddleware, currentuserConroller);

export default router;
