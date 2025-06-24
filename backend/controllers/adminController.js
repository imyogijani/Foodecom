import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Subscription from "../models/subscriptionModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "shopowner" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get weekly user registration stats
    const weeklyUserStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("seller", ["names", "shopName"]);

    // Calculate total revenue
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        revenue: revenue[0]?.total || 0,
        userStats: weeklyUserStats,
        recentOrders: recentOrders.map((order) => ({
          _id: order._id,
          customerName: order.user?.name || "Unknown Customer",
          shopName:
            order.seller?.names || order.seller?.shopName || "Unknown Shop",
          amount: order.totalAmount,
          status: order.status,
          date: order.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

// Get all products with shop details
export const getAllProducts = async (req, res) => {
  try {
    const { populateCategory, populateSubcategory } = req.query;
    let query = Product.find().populate("seller", ["names", "shopName"]);

    if (populateCategory === "true") {
      query = query.populate("category");
    }

    if (populateSubcategory === "true") {
      query = query.populate("subcategory");
    }

    const products = await query;

    res.json({
      success: true,
      products: products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        image: product.image,
        stock: product.stock,
        status: product.status,
        shopId: product.seller?._id || null,
        shopName:
          product.seller?.names || product.seller?.shopName || "Unknown Shop",
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await User.find({ role: "shopowner" }).select(
      "_id names shopName email status createdAt"
    );

    res.json({
      success: true,
      shops: shops.map((shop) => ({
        _id: shop._id,
        names: shop.names,
        shopName: shop.shopName,
        email: shop.email,
        status: shop.status,
        createdAt: shop.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shops",
      error: error.message,
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('subscription').select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users.map((user) => ({
        _id: user._id,
        name: user.names || user.shopName,
        email: user.email,
        role: user.role.toLowerCase(),
        status: user.status || "active",
        createdAt: user.createdAt,
        subscription: user.role === "shopowner" && user.subscription ? {
          planName: user.subscription.planName,
          _id: user.subscription._id
        } : undefined
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Update user role and status
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (role) {
      user.role = role;
    }
    if (status) {
      user.status = status;
    }

    await user.save();

    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Update user role


// Update shopowner subscription plan and features
export const updateShopownerSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "shopowner") {
      return res.status(404).json({
        success: false,
        message: "Shopowner not found",
      });
    }
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan",
      });
    }
    user.subscription = subscriptionId;
    user.subscriptionFeatures = subscription.includedFeatures;
    user.subscriptionStartDate = new Date();
    await user.save();
    res.json({
      success: true,
      message: "Shopowner subscription updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating shopowner subscription",
      error: error.message,
    });
  }
};

// Get full details of a shopowner by ID (for admin)
export const getShopownerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("subscription");
    if (!user || user.role !== "shopowner") {
      return res.status(404).json({ success: false, message: "Shopowner not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch shopowner details", error: err.message });
  }
};
