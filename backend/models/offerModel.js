import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: Number, required: true },
    price: { type: Number },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, // can be set to end of today
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Offer = mongoose.model("offers", offerSchema);
export default Offer;
