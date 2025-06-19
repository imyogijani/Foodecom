import path from "path";
 import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, status } = req.body;
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    let image = "";

    // Handle file upload
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename =
        Date.now() + "-" + file.name.replace(/\s+/g, "-").toLowerCase();
      const uploadPath = path.join(
        __dirname,
        "../public/uploads/products",
        filename
      );

      await file.mv(uploadPath);
      image = `/uploads/${filename}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      status,
      image,
      seller: req.userId,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const { populateCategory } = req.query;
    let query = Product.find({ seller: req.userId });

    if (populateCategory === 'true') {
      query = query.populate('category');
    }

    const products = await query.sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { category, ...updateData } = req.body;

    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
      updateData.category = category;
    }
    const product = await Product.findOneAndUpdate(
      { _id: productId, seller: req.userId },
      updateData,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOneAndDelete({
      _id: productId,
      seller: req.userId,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
