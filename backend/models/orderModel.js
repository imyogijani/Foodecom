// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     items: [
//       {
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//         quantity: { type: Number, required: true },
//         image: { type: String },
//       },
//     ],
//     total: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "processing", "completed", "cancelled"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("orders", orderSchema);
// export default Order;

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
//   products: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: Number,
//       price: Number,
//       dealApplied: Boolean,
//     },
//   ],
//   totalAmount: Number,
//   status: {
//     type: String,
//     enum: ["pending", "paid", "cancelled", "failed"],
//     default: "pending",
//   },
//   paymentId: String, // Razorpay/Stripe ID
//   address: String,
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", orderSchema);

// models/orderModel.js
// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
//   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true }, // snapshot at order time
//   discount: { type: Number, default: 0 }, // applied deal/offer
//   finalPrice: { type: Number, required: true }, // after discount
// });

// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
//     items: [orderItemSchema],
//     shippingAddress: {
//       fullName: String,
//       addressLine: String,
//       city: String,
//       state: String,
//       pincode: String,
//       phone: String,
//     },
//     totalAmount: { type: Number, required: true },
//     paymentMethod: {
//       type: String,
//       enum: ["cash_on_delivery", "cashfree_upi", "cashfree_qr"],
//       default: "cash_on_delivery",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },
//     orderStatus: {
//       type: String,
//       enum: ["processing", "shipped", "delivered", "cancelled"],
//       default: "processing",
//     },
//     paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "payments", default: null },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("orders", orderSchema);
// export default Order;

import mongoose from "mongoose";

// Per Item Schema — supports multi-seller orders
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // snapshot price at order time
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true }, // price after discount
  deliveryStatus: {
    type: String,
    enum: [
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "processing",
  },
  deliveryPartner: {
    type: String,
    enum: ["Shiprocket", "Delhivery", "Shadowfax", "Manual"],
    default: "Manual",
  },
  deliveryTrackingId: { type: String, default: null }, // AWB or tracking number
  deliveryCharge: { type: Number, default: 0 },
  expectedDeliveryDate: {
    type: Date,
    default: null,
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deals", // or "offers" if you use separate offer model
    default: null,
  },
  isSettledToSeller: {
    type: Boolean,
    default: false,
  },
  settledAt: {
    type: Date,
    default: null,
  },
});

// Shipping Address
const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    totalAmount: { type: Number, required: true }, // includes product + delivery charges
    subTotal: { type: Number, required: true }, // only product total

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "QR", "NetBanking", "Card", "Wallet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "in_transit", "delivered", "cancelled"],
      default: "processing",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    couponDescription: {
      type: String,
      default: null,
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },

    notes: { type: String },
    refundRequested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("orders", orderSchema);
export default Order;
