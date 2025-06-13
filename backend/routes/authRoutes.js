import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
  updateProfileController,
  uploadAvatarController,
  verifyToken,
} from "../controllers/authController.js";
import upload from '../middlewares/uploadMiddleware.js';
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

// Upload avatar || POST
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), uploadAvatarController);

// Serve avatar images
router.get('/uploads/avatars/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, '../public/uploads/avatars/', filename));
});

export default router;
