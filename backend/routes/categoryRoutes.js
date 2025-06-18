import express from "express";
import {
  createCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// routes
// Create Category
router.post("/", authenticateToken, authorizeAdmin, createCategoryController);

// Create Subcategory
router.post(
  "/subcategory",
  authenticateToken,
  authorizeAdmin,
  createCategoryController
);

// Update Category
router.put(
  "/update-category/:id",
  authenticateToken,
  authorizeAdmin,
  updateCategoryController
);

// Get All Categories
router.get("/get-category", categoryController);

// Single Category
router.get("/single-category/:slug", singleCategoryController);

// Delete Category
router.delete(
  "/delete-category/:id",
  authenticateToken,
  authorizeAdmin,
  deleteCategoryController
);

export default router;
