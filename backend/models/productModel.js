import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false, // Subcategory is optional
    },
    image: {
      type: [String], // Array of image URLs
      validate: [(arr) => arr.length <= 10, "Max 10 images allowed"],
      required: true,
    },
    // VARIANTS ARRAY
    variants: [
      {
        name: { type: String, required: true }, // "Default", "Premium", etc.
        price: { type: Number, required: true },
        inStock: { type: Boolean, default: true },
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    brand: {
      type: String,
      required: false,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    technicalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicalDetails",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema);

export default Product;
