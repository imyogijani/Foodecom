import express from "express";
import {
  createBrandController,
  getAllBrandsController,
  getBrandByIdController,
  updateBrandController,
  deleteBrandController,
  getProductsByBrand,
} from "../controllers/brandController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.post("/create", upload.single("logo"), createBrandController);
router.get("/", getAllBrandsController);
router.get("/products-by-brand/:brandId", getProductsByBrand);
router.get("/:id", getBrandByIdController);
router.put("/:id", upload.single("logo"), updateBrandController);
router.delete("/:id", deleteBrandController);
export default router;
