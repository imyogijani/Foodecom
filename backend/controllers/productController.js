import path from "path";
 import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const addProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, subcategory, stock, status } = req.body;



    // Validate subcategory if provided
    let subcategoryDoc = null;
    if (subcategory) {
      subcategoryDoc = await Category.findById(subcategory);
      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Subcategory not found",
        });
      }
    }
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
      image = `/uploads/products/${filename}`; // Store full path for correct frontend usage
    } else {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // --- Dynamic Subscription Feature Enforcement ---
    const user = await (await import("../models/userModel.js")).default.findById(req.userId).populate("subscription");
    if (user && user.role === "shopowner" && user.subscription) {
      // Parse features from user.subscriptionFeatures (array of strings)
      const features = Array.isArray(user.subscriptionFeatures) ? user.subscriptionFeatures : [];
      // Product limit enforcement
      const productLimitFeature = features.find(f => f.startsWith("productLimit:"));
      if (productLimitFeature) {
        const limit = parseInt(productLimitFeature.split(":")[1], 10);
        const productCount = await Product.countDocuments({ seller: user._id });
        if (!isNaN(limit) && productCount >= limit) {
          return res.status(403).json({
            success: false,
            message: `Your plan allows only ${limit} products. Upgrade your plan to add more.`
          });
        }
      }
      // Example: Analytics access enforcement (template for future features)
      // if (!features.includes("analytics")) {
      //   // Optionally restrict analytics access elsewhere in the code
      // }
      // Add more feature checks here as needed
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : undefined,
      category,
      subcategory: subcategory || undefined, // Only add if provided
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
    const { category, subcategory, discount, ...updateData } = req.body;

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

    if (subcategory) {
      const subcategoryDoc = await Category.findById(subcategory);
      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Subcategory not found",
        });
      }
      updateData.subcategory = subcategory;
    } else if (subcategory === '') {
      // If subcategory is explicitly set to empty, remove it from the product
      updateData.subcategory = undefined;
    }

    if (discount !== undefined && discount !== null && discount !== '') {
      updateData.discount = Number(discount);
    } else if (discount === '') {
      updateData.discount = undefined;
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

export const getAllProducts = async (req, res) => {
  try {
    const { populateCategory, populateSubcategory } = req.query;
    let query = Product.find({});

    if (populateCategory === 'true') {
      query = query.populate('category');
    }

    if (populateSubcategory === 'true') {
      query = query.populate('subcategory');
    }

    const products = await query.sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all products",
      error: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    // Ensure only admin can delete all products
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    await Product.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'All products deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting all products:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting all products',
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
