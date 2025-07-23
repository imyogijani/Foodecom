import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getHomeMenuItems,
  toggleStatus,
  getAllProductMenusWithFilters,
} from "../controllers/menuItemController.js";

const router = express.Router();

router.post("/", createMenuItem);
router.get("/home", getHomeMenuItems);
router.get("/products", getAllProductMenusWithFilters);
router.get("/all", getAllMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/status", toggleStatus);

export default router;
