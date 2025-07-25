import path from "path";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import TechnicalDetails from "../models/technicalDetails.js";
import { fileURLToPath } from "url";
import Seller from "../models/sellerModel.js";
// import { attachActiveDeals } from "../utils/attachActiveDeals.js";
import { getFeatureLimit } from "../helpers/checkSubscriptionFeature.js";

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
      isPremium,
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

      const { doc } = await findOrCreateTechnicalDetails(
        JSON.parse(req.body.technicalDetails) //  ensure it's a JS object
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

    const sellerDoc = await Seller.findOne({ user: req.userId });
    if (!sellerDoc) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found for this user",
      });
    }

    // Premium check

    const isTryingPremium = isPremium === true || isPremium === "true";

    // Step 1: Get seller info
    const seller = await Seller.findOne({ user: req.userId });
    if (!seller)
      return res.status(400).json({ message: "Seller profile not found." });

    // Step 2: Get user subscription details
    // const  = await User.findById(userId);

    // === PREMIUM VALIDATION START ===
    const now = new Date();
    if (
      !user.subscription ||
      !user.subscriptionStartDate ||
      !user.subscriptionEndDate ||
      now < user.subscriptionStartDate ||
      now > user.subscriptionEndDate
    ) {
      return res
        .status(403)
        .json({ message: "Subscription expired or not active." });
    }

    // STEP 2: Get features
    const features = Array.isArray(user.subscriptionFeatures)
      ? user.subscriptionFeatures
      : [];

    console.log(features);

    if (isTryingPremium) {
      if (!features.includes("featuredListing")) {
        return res
          .status(403)
          .json({ message: "Your plan does not support premium listings." });
      }
      const premiumLimit = getFeatureLimit(features, "productLimit") || 1;
      console.log("PremiumProduct count limit", premiumLimit);

      const premiumCount = await Product.countDocuments({
        seller: seller._id,
        isPremium: true,
      });

      if (premiumCount >= premiumLimit) {
        return res.status(403).json({
          message: `You can only add ${premiumLimit} premium products. Upgrade your plan.`,
        });
      }
    }

    let image = [];
    if (req.files && req.files.length > 0) {
      image = req.files.map((file) => `/uploads/products/${file.filename}`);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
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
      seller: sellerDoc._id,
      technicalDetails: techDetailsRef || undefined,
      isPremium: isTryingPremium,
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

// export const getSellerProducts = async (req, res) => {
//   try {
//     const { populateCategory } = req.query;
//     let query = Product.find({ seller: req.userId });

//     if (populateCategory === "true") {
//       query = query.populate("category");
//     }

//     const products = await query.sort({
//       createdAt: -1,
//     });
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// };
export const getSellerProducts = async (req, res) => {
  try {
    const { populateCategory } = req.query;

    // Step 1: Find Seller based on logged-in user ID
    const seller = await Seller.findOne({ user: req.userId });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found for this user",
      });
    }

    // Step 2: Use seller._id to find products
    let query = Product.find({ seller: seller._id });

    if (populateCategory === "true") {
      query = query.populate("category");
    }

    const products = await query.sort({ createdAt: -1 });

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

// export const updateProduct = async (req, res) => {
//   try {
//     const { id: productId } = req.params;
//     const {
//       category,
//       subcategory,
//       discount,
//       brand,
//       status,
//       stock,
//       price,
//       ...otherUpdateData
//     } = req.body;

//     let updateData = { ...otherUpdateData };

//     if (category) {
//       const categoryDoc = await Category.findById(category);
//       if (!categoryDoc) {
//         return res.status(400).json({
//           success: false,
//           message: "Category not found",
//         });
//       }
//       updateData.category = category;
//     }

//     if (subcategory) {
//       const subcategoryDoc = await Category.findById(subcategory);
//       if (!subcategoryDoc) {
//         return res.status(400).json({
//           success: false,
//           message: "Subcategory not found",
//         });
//       }
//       updateData.subcategory = subcategory;
//     } else if (subcategory === "") {
//       updateData.subcategory = undefined;
//     }

//     if (discount !== undefined && discount !== null && discount !== "") {
//       updateData.discount = Number(discount);
//     } else if (discount === "") {
//       updateData.discount = undefined;
//     }

//     if (brand !== undefined && brand !== null && brand !== "") {
//       updateData.brand = brand;
//     } else if (brand === "") {
//       updateData.brand = undefined;
//     }

//     // Handle specific fields for admin updates
//     if (status !== undefined) {
//       updateData.status = status;
//     }
//     if (stock !== undefined) {
//       updateData.stock = Number(stock);
//     }
//     if (price !== undefined) {
//       updateData.price = Number(price);
//     }

//     let findQuery = { _id: productId };

//     // If the request is not from an admin, ensure the seller owns the product
//     if (req.user && req.user.role !== "admin") {
//       findQuery.seller = req.userId;
//     }

//     const product = await Product.findOneAndUpdate(findQuery, updateData, {
//       new: true,
//       runValidators: true,
//     });
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating product",
//       error: error.message,
//     });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
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
      isPremium,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Ownership check for non-admins
    if (
      req.user &&
      req.user.role !== "admin" &&
      product.seller.toString() !== req.userId
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Validate category
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }
      product.category = category;
    }

    // Validate subcategory
    if (subcategory) {
      const subcategoryDoc = await Category.findById(subcategory);
      if (!subcategoryDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Subcategory not found" });
      }
      product.subcategory = subcategory;
    } else if (subcategory === "") {
      product.subcategory = undefined;
    }

    // Parse variants
    if (variants) {
      try {
        const parsedVariants = JSON.parse(variants);
        if (!Array.isArray(parsedVariants)) {
          return res
            .status(400)
            .json({ success: false, message: "Variants must be an array" });
        }
        product.variants = parsedVariants;
      } catch (e) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid JSON in variants", e });
      }
    }

    // Handle optional fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discount !== undefined)
      product.discount = discount === "" ? undefined : Number(discount);
    if (stock !== undefined) product.stock = Number(stock);
    if (status !== undefined) product.status = status;
    if (brand !== undefined) product.brand = brand === "" ? undefined : brand;

    // Get seller
    const seller = await Seller.findOne({ user: req.userId });
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller profile not found" });
    }

    // Subscription & premium validation
    const userModel = (await import("../models/userModel.js")).default;
    const user = await userModel.findById(req.userId).populate("subscription");

    if (
      !user.subscription ||
      !user.subscriptionStartDate ||
      !user.subscriptionEndDate ||
      new Date() < user.subscriptionStartDate ||
      new Date() > user.subscriptionEndDate
    ) {
      return res
        .status(403)
        .json({ message: "Subscription expired or not active." });
    }

    const features = Array.isArray(user.subscriptionFeatures)
      ? user.subscriptionFeatures
      : [];

    const isTryingPremium = isPremium === true || isPremium === "true";
    if (isTryingPremium) {
      if (!features.includes("featuredListing")) {
        return res.status(403).json({
          message: "Your plan does not support premium listings.",
        });
      }

      const getFeatureLimit = (featuresArray, key) => {
        const match = featuresArray.find((f) => f.startsWith(`${key}:`));
        return match ? parseInt(match.split(":")[1], 10) : null;
      };

      const premiumLimit = getFeatureLimit(features, "premiumLimit") || 1;
      const premiumCount = await Product.countDocuments({
        seller: seller._id,
        isPremium: true,
        _id: { $ne: product._id }, // exclude current product
      });

      if (premiumCount >= premiumLimit && !product.isPremium) {
        return res.status(403).json({
          message: `You can only add ${premiumLimit} premium products. Upgrade your plan.`,
        });
      }

      product.isPremium = true;
    } else {
      product.isPremium = false;
    }

    // Handle technicalDetails
    if (technicalDetailsId) {
      const detail = await TechnicalDetails.findById(technicalDetailsId);
      if (!detail) {
        return res.status(400).json({ message: "Invalid technicalDetailsId" });
      }
      product.technicalDetails = detail._id;
    } else if (req.body.technicalDetails) {
      const { findOrCreateTechnicalDetails } = await import(
        "../helpers/compareTechnicalDetails.js"
      );
      const { doc } = await findOrCreateTechnicalDetails(
        JSON.parse(req.body.technicalDetails)
      );
      product.technicalDetails = doc._id;
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
      product.image = newImages;
    }

    // Save updated product
    await product.save();

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
    const {
      populateCategory,
      populateSubcategory,
      categoryId,
      brand,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      minPrice = 0,
      maxPrice = 9999999,
      page = 1,
      limit = 10,
    } = req.query;

    //  1. Dynamic Filters
    const filter = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    if (categoryId && categoryId !== "undefined" && categoryId !== "") {
      filter.category = categoryId;
    }

    if (brand && brand !== "undefined" && brand !== "") {
      filter.brand = brand;
    }

    //  2. Search Filter
    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ];
    }

    //  3. Sorting
    const sortOptions = {
      price: "finalPrice",
      rating: "averageRating",
      reviews: "totalReviews",
      createdAt: "createdAt",
    };

    const sortField = sortOptions[sortBy] || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    // console.log("Sorting by:", sortField, "Order:", sortOrder);

    //  4. Query + Sorting
    let query = Product.find(filter).sort({ [sortField]: sortOrder });

    //  5. Populate
    if (populateCategory === "true") {
      query = query.populate("category");
    }
    if (populateSubcategory === "true") {
      query = query.populate("subcategory");
    }
    query = query.populate({
      path: "activeDeal",
      match: { _id: { $ne: null } }, // OR use more filter like startDate
    });
    //  6. Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    //7. Execute Query
    const products = await query;
    const totalProducts = await Product.countDocuments(filter);

    // const updatedProducts = await attachActiveDeals(products);

    // 8. Response
    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching all products",
      error: error.message,
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Step 1: Get the current product to find its category
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 2: Count total related products in same category (excluding current)
    const totalRelated = await Product.countDocuments({
      category: currentProduct.category,
      _id: { $ne: productId },
    });

    // Step 3: Fetch related products with pagination
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId },
    })
      .skip(skip)
      .limit(limit)
      .populate("category subcategory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products: relatedProducts,
      totalProducts: totalRelated,
      totalPages: Math.ceil(totalRelated / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching related products",
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
