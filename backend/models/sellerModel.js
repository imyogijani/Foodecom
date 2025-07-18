// models/sellerModel.js
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // reference to the main users table
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    shopImage: {
      type: String, // Main shop image
      default: null,
    },
    shopImages: {
      type: [String], // Optional: Array of additional shop images
      default: [],
    },
    ownerName: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Referencing the Category collection
      },
    ],
    location: {
      type: String,
      default: "",
    },
    address: {
      type: String, // Full address of the shop
      default: "",
    },
    specialist: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);
const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
