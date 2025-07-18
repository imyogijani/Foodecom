import path from "path";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import TechnicalDetails from "../models/technicalDetails.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      subcategory,
      stock,
      status,
      brand,
      variants,
      technicalDetailsId,
    } = req.body;

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

    let image = [];
    if (req.files && req.files.length > 0) {
      image = req.files.map((file) => `/uploads/products/${file.filename}`);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
    }

    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
        if (!Array.isArray(parsedVariants)) {
          return res
            .status(400)
            .json({ success: false, message: "Variants must be an array" });
        }
      } catch (e) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid JSON in variants", e });
      }
    }

    // 4. Optional: Check technicalDetails exists
    let techDetailsRef = null;

    if (technicalDetailsId) {
      const details = await TechnicalDetails.findById(technicalDetailsId);
      if (!details) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid technicalDetailsId" });
      }
      techDetailsRef = details._id;
    } else if (req.body.technicalDetails) {
      const { findOrCreateTechnicalDetails } = await import(
        "../helpers/compareTechnicalDetails.js"
      );

      const { reused, doc } = await findOrCreateTechnicalDetails(
        req.body.technicalDetails
      );
      techDetailsRef = doc._id;
    }

    // --- Dynamic Subscription Feature Enforcement ---
    const user = await (await import("../models/userModel.js")).default
      .findById(req.userId)
      .populate("subscription");
    if (user && user.role === "shopowner" && user.subscription) {
      // Parse features from user.subscriptionFeatures (array of strings)
      const features = Array.isArray(user.subscriptionFeatures)
        ? user.subscriptionFeatures
        : [];
      // Product limit enforcement (generalized for any plan, overall count)
      const productLimitFeature = features.find((f) =>
        f.startsWith("productLimit:")
      );
      if (!productLimitFeature) {
        console.error(
          `Shopowner ${user._id} has no productLimit feature in subscriptionFeatures!`
        );
        return res.status(403).json({
          success: false,
          message:
            "Your subscription plan does not allow adding products. Please contact support.",
        });
      }
      const limit = parseInt(productLimitFeature.split(":")[1], 10);
      // Count ALL products for this seller, regardless of category
      const productCount = await Product.countDocuments({ seller: user._id });
      if (!isNaN(limit) && productCount >= limit) {
        // Prevent duplicate notifications
        const Notification = (await import("../models/notificationModel.js"))
          .default;
        const existing = await Notification.findOne({
          recipient: user._id,
          type: "system",
          title: "Product Limit Reached",
          isRead: false,
        });
        if (!existing) {
          const { createNotification } = await import(
            "../controllers/notificationController.js"
          );
          await createNotification({
            title: "Product Limit Reached",
            message: `You have reached your plan's product limit (${limit}). Upgrade your plan to add more products.`,
            type: "system",
            recipient: user._id,
            relatedModel: "products",
            priority: "high",
          });
        }
        return res.status(403).json({
          success: false,
          message: `Your plan allows only ${limit} products. Upgrade your plan to add more.`,
        });
      }
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
      image: image,
      variants: parsedVariants,
      brand: brand || undefined,
      seller: req.userId,
      technicalDetails: techDetailsRef || undefined,
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

    if (populateCategory === "true") {
      query = query.populate("category");
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
    const { id: productId } = req.params;
    const {
      category,
      subcategory,
      discount,
      brand,
      status,
      stock,
      price,
      ...otherUpdateData
    } = req.body;

    let updateData = { ...otherUpdateData };

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
    } else if (subcategory === "") {
      updateData.subcategory = undefined;
    }

    if (discount !== undefined && discount !== null && discount !== "") {
      updateData.discount = Number(discount);
    } else if (discount === "") {
      updateData.discount = undefined;
    }

    if (brand !== undefined && brand !== null && brand !== "") {
      updateData.brand = brand;
    } else if (brand === "") {
      updateData.brand = undefined;
    }

    // Handle specific fields for admin updates
    if (status !== undefined) {
      updateData.status = status;
    }
    if (stock !== undefined) {
      updateData.stock = Number(stock);
    }
    if (price !== undefined) {
      updateData.price = Number(price);
    }

    let findQuery = { _id: productId };

    // If the request is not from an admin, ensure the seller owns the product
    if (req.user && req.user.role !== "admin") {
      findQuery.seller = req.userId;
    }

    const product = await Product.findOneAndUpdate(findQuery, updateData, {
      new: true,
      runValidators: true,
    });
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
    const { populateCategory, populateSubcategory, categoryId, brand } =
      req.query;
    let query = Product.find({});

    if (categoryId) {
      query = query.where("category").equals(categoryId);
    }

    if (brand) {
      query = query.where("brand").equals(brand);
    }

    if (populateCategory === "true") {
      query = query.populate("category");
    }

    if (populateSubcategory === "true") {
      query = query.populate("subcategory");
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

export const getSingleProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    // Ensure only admin can delete all products
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    await Product.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All products deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all products:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting all products",
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
