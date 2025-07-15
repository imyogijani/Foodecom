/* eslint-disable no-unused-vars */
import Deal from "../models/dealModel.js";
import Notification from "../models/notificationModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Create a new deal
export const createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      productId,
      discountPercentage,
      startDate,
      endDate,
      maxQuantity,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let dealPrice = product.price;
    if (discountPercentage) {
      dealPrice = product.price - (product.price * discountPercentage) / 100;
    }

    const deal = new Deal({
      title,
      description,
      product: productId,
      seller: req.user._id,
      originalPrice: product.price,
      discountPercentage,
      dealPrice, // ensure dealPrice is set
      startDate,
      endDate,
      maxQuantity,
    });

    await deal.save();

    // Create notification for admin approval
    const adminUsers = await User.find({ role: "admin" });
    if (adminUsers.length > 0) {
      for (const admin of adminUsers) {
        const notification = new Notification({
          title: "New Deal Request",
          message: `A new deal "${title}" requires your approval`,
          type: "deal_request",
          recipient: admin._id,
          sender: req.user._id,
          relatedId: deal._id,
          relatedModel: "deals",
        });
        await notification.save();
      }
    }

    res.status(201).json({
      message: "Deal created and sent for approval",
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin approves a deal
export const approveDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    deal.status = "approved";
    deal.approvedBy = req.user._id;
    deal.approvedAt = new Date();
    await deal.save();

    const product = await Product.findById(deal.product);
    if (product) product.discount = deal.discountPercentage;
    await product.save();

    const notification = new Notification({
      title: "Deal Approved",
      message: `Deal "${deal.title}" has been approved and is now active`,
      type: "deal_approved",
      recipient: deal.seller,
      relatedId: deal._id,
      relatedModel: "deals",
    });

    await notification.save();

    res.status(200).json({
      message: "Deal approved",
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin rejects a deal
export const rejectDeal = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { rejectionReason } = req.body;

    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    deal.status = "rejected";
    deal.rejectionReason = rejectionReason;
    await deal.save();

    const notification = new Notification({
      title: "Deal Rejected",
      message: `Deal "${deal.title}" has been rejected. Reason: ${rejectionReason}`,
      type: "deal_rejected",
      recipient: deal.seller,
      relatedId: deal._id,
      relatedModel: "deals",
    });

    await notification.save();

    res.status(200).json({
      message: "Deal rejected",
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// End a deal
export const endDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    deal.status = "ended";
    await deal.save();

    // Notify all admins about deal ending
    const adminUsers = await User.find({ role: "admin" });
    if (adminUsers.length > 0) {
      for (const admin of adminUsers) {
        const notification = new Notification({
          title: "Deal Ended",
          message: `Deal "${deal.title}" has ended and is no longer active`,
          type: "deal_ended",
          recipient: admin._id,
          sender: req.user._id,
          relatedId: deal._id,
          relatedModel: "deals",
        });
        await notification.save();
      }
    }

    res.status(200).json({
      message: "Deal ended",
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all deals for admin
export const getAllDeals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const deals = await Deal.find(filter)
      .populate("product", "name image")
      .populate("seller", "names email shopName shopownerName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(filter);

    res.status(200).json({
      success: true,
      deals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get seller's deals
export const getSellerDeals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { seller: req.user._id };
    if (status) filter.status = status;

    const deals = await Deal.find(filter)
      .populate("product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(filter);

    res.status(200).json({
      success: true,
      deals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get active deals for offers page
export const getActiveDeals = async (req, res) => {
  const featured = req.query.featured === "true";
  try {
    const now = new Date();
    const deals = await Deal.find({
      status: "approved",
      startDate: { $lte: now },
      endDate: { $gte: now },
      ...(featured ? { featuredInOffers: true } : {}),
    })
      .populate("product", "name image description averageRating totalReviews")
      .populate("seller", "names shopName")
      .sort({ createdAt: -1 });
    const enrichedDeals = deals.map((deal) => {
      const moneySaved = deal.originalPrice - deal.dealPrice;
      return {
        ...deal._doc,
        moneySaved,
      };
    });
    res.status(200).json({
      success: true,
      deals: enrichedDeals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deal by ID
export const getDealById = async (req, res) => {
  try {
    const { dealId } = req.params;
    const deal = await Deal.findById(dealId)
      .populate("product")
      .populate("seller", "names email")
      .populate("approvedBy", "names email");

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.status(200).json({
      success: true,
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update deal (only for pending deals)
export const updateDeal = async (req, res) => {
  try {
    const { dealId } = req.params;
    const updateData = req.body;

    const deal = await Deal.findOne({ _id: dealId, seller: req.user._id });
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.status !== "pending") {
      return res.status(400).json({ message: "Can only update pending deals" });
    }

    // Update deal
    Object.assign(deal, updateData);
    await deal.save();

    res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete deal (only for pending deals)
export const deleteDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findOne({ _id: dealId, seller: req.user._id });
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.status !== "pending") {
      return res.status(400).json({ message: "Can only delete pending deals" });
    }

    await Deal.findByIdAndDelete(dealId);

    res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
