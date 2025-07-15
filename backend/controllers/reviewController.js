import Review from "../models/reviewModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

export const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // 1 Validate input
    if (!product || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2 Validate productId format (optional but good)
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if review already exists by the user for the same product
    const existingReview = await Review.findOne({
      product,
      user: req.user?._id || "000000000000000000000000",
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // 4 Save new review
    const review = new Review({
      user: req.user?._id || "000000000000000000000000",
      product,
      rating,
      comment,
    });

    await review.save();

    // 5 Recalculate product average rating and total reviews
    const reviews = await Review.find({ product });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    // 6 Update product's review stats
    await Product.findByIdAndUpdate(product, {
      averageRating: averageRating.toFixed(1),
      totalReviews,
    });

    // 7 Respond
    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", err });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const productId = review.product;

    await review.deleteOne();

    // Update product stats
    const reviews = await Review.find({ product: productId });
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avgRating.toFixed(1),
      totalReviews,
    });

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review", err });
  }
};
