import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
  updateProfileController,
  verifyToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes
// Register || POST
router.post("/register", registerController);

// Login || POST
router.post("/login", loginController);

// Get current user || GET
router.get("/current-user", authenticateToken, currentUserController);

// Update profile || PUT
router.put("/update-profile", authenticateToken, updateProfileController);

// Verify token || GET
router.get("/verify-token", authenticateToken, verifyToken);

export default router;
