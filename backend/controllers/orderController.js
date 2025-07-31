import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import Cart from "../models/cartModal.js";
// import Order from "../models/orderModel.js";
import Deal from "../models/dealModel.js";
import Offer from "../models/offerModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Seller from "..//models/sellerModel.js";

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// export const getAllOrdersAdmin = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("Error fetching all orders for admin:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching all orders",
//       error: error.message,
//     });
//   }
// };
// GET /admin/orders?page=1&limit=10&orderStatus=delivered&paymentStatus=paid&paymentMethod=UPI&fromDate=2024-07-01&toDate=2024-07-31
// Authorization: Bearer <admin-token>

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const {
    orderStatus,
    paymentStatus,
    paymentMethod,
    fromDate,
    toDate,
    userId,
  } = req.query;

  const filter = {};

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (userId) {
    filter.userId = userId;
  }

  if (fromDate && toDate) {
    filter.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  const totalOrders = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name email") // fetch user info
    .select(
      "userId items totalAmount paymentMethod paymentStatus orderStatus isPaid createdAt"
    );

  res.status(200).json({
    success: true,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
    orders,
  });
});

// export const createOrder = async (req, res) => {
//   try {
//     const { items, total } = req.body;
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No items in order" });
//     }
//     if (!total || typeof total !== "number") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Total amount required" });
//     }
//     const order = new Order({
//       user: req.userId,
//       items,
//       total,
//       status: "pending",
//     });
//     await order.save();
//     res.status(201).json({ success: true, order });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating order",
//       error: error.message,
//     });
//   }
// };

// controllers/orderController.js

// export const createOrder = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const {
//     shippingAddress,
//     paymentMethod,
//     deliveryPartner = "Manual",
//     appliedCoupon = null, // { code, discount, offerId, description }
//   } = req.body;

//   if (!shippingAddress || !paymentMethod) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   const cart = await Cart.findOne({ userId }).populate("items.productId");
//   if (!cart || cart.items.length === 0) {
//     return res.status(400).json({ message: "Cart is empty." });
//   }

//   let subTotal = 0;
//   let deliveryCharge = 50;

//   const items = await Promise.all(
//     cart.items.map(async (item) => {
//       const product = item.productId;

//       let finalPrice = product.price;
//       const deal = await Deal.findOne({
//         product: product._id,
//         status: "active",
//         startDate: { $lte: new Date() },
//         endDate: { $gte: new Date() },
//       });

//       if (deal) {
//         finalPrice = deal.dealPrice;
//       }

//       const quantity = item.quantity;
//       const productTotal = finalPrice * quantity;
//       subTotal += productTotal;

//       return {
//         productId: product._id,
//         sellerId: product.seller,
//         quantity,
//         price: product.price,
//         finalPrice,
//         deliveryStatus: "processing",
//         deliveryPartner,
//         deliveryCharge: 0,
//         commission: 0, // fill later if needed
//       };
//     })
//   );

//  let couponDiscount = 0;
// let couponCode = null;
// let couponDescription = null;
// let offerId = null;

// if (appliedCoupon && appliedCoupon.code) {
//   const offer = await Offer.findOne({
//     code: appliedCoupon.code,
//     isActive: true,
//     startDate: { $lte: new Date() },
//     endDate: { $gte: new Date() },
//   });

//   if (!offer) {
//     return res.status(400).json({ message: "Invalid or expired coupon." });
//   }

//   if (offer.usageLimit > 0 && offer.usedCount >= offer.usageLimit) {
//     return res.status(400).json({ message: "Coupon usage limit reached." });
//   }

//   // Recalculate subTotal here or reuse previous calculation
//   if (offer.minCartValue && subTotal < offer.minCartValue) {
//     return res.status(400).json({
//       message: `Minimum cart value ₹${offer.minCartValue} required to use this coupon.`,
//     });
//   }

//   // Apply discount logic again (flat or percentage)
//   let validSubTotal = subTotal; // or recalculate only on valid items if needed
//   if (offer.type !== "CART") {
//     // Optional: filter valid items
//     // You can reuse logic from `applyCoupon`
//   }

//   if (offer.discountType === "FLAT") {
//     couponDiscount = offer.discountValue;
//   } else if (offer.discountType === "PERCENTAGE") {
//     couponDiscount = Math.floor((validSubTotal * offer.discountValue) / 100);
//     if (offer.maxDiscountAmount && couponDiscount > offer.maxDiscountAmount) {
//       couponDiscount = offer.maxDiscountAmount;
//     }
//   }

//   // ✅ Save to order
//   couponCode = offer.code;
//   couponDescription = offer.description || "";
//   offerId = offer._id;
// }

//   const totalAmount = subTotal + deliveryCharge - couponDiscount;

//   const order = new Order({
//     userId,
//     items,
//     shippingAddress,
//     subTotal,
//     totalAmount,
//     paymentMethod,
//     paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
//     isPaid: false,

//     // Coupon tracking
//     couponCode,
//     couponDiscount,
//     couponDescription,
//     offerId,
//   });

//   await order.save();

//   // Empty cart
//   cart.items = [];
//   await cart.save();

//   res.status(201).json({ success: true, order });
// });

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    shippingAddress,
    paymentMethod,
    deliveryPartner = "Manual",
    appliedCoupon = null, // { code, discount, offerId, description }
  } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  let subTotal = 0;
  let deliveryCharge = 50;
  let couponDiscount = 0;
  let couponCode = null;
  let couponDescription = null;
  let offerId = null;
  let validItems = [];

  const items = await Promise.all(
    cart.items.map(async (item) => {
      const product = item.productId;

      const quantity = item.quantity;
      let finalPrice = product.finalPrice; // default: price after discount

      // If product has an activeDeal, check if it's still active
      if (product.activeDeal) {
        const now = new Date();

        const deal = await Deal.findOne({
          _id: product.activeDeal,
          startDate: { $lte: now },
          endDate: { $gte: now },
        });

        if (deal) {
          finalPrice = deal.dealPrice;
        }
      }

      const productTotal = finalPrice * quantity;
      subTotal += productTotal;

      return {
        product,
        productId: product._id,
        sellerId: product.seller,
        quantity,
        price: product.price,
        finalPrice,
        productTotal,
      };
    })
  );

  if (appliedCoupon && appliedCoupon.code) {
    const offer = await Offer.findOne({
      code: appliedCoupon.code,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!offer) {
      return res.status(400).json({ message: "Invalid or expired coupon." });
    }

    if (offer.usageLimit > 0 && offer.usedCount >= offer.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached." });
    }

    if (offer.minCartValue > 0 && subTotal < offer.minCartValue) {
      return res.status(400).json({
        message: `Minimum cart value ₹${offer.minCartValue} required to use this coupon.`,
      });
    }

    // Filter valid items based on offer type
    for (const item of items) {
      const product = item.product;
      const isProductMatched = offer.products?.includes(product._id);
      const isCategoryMatched = offer.categories?.includes(product.category);
      const isBrandMatched = offer.brands?.includes(product.brand);

      if (
        offer.type === "CART" ||
        (offer.type === "PRODUCT" && isProductMatched) ||
        (offer.type === "CATEGORY" && isCategoryMatched) ||
        (offer.type === "BRAND" && isBrandMatched)
      ) {
        validItems.push(item);
      }
    }

    if (offer.type !== "CART" && validItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Coupon not applicable to your cart items." });
    }

    // Calculate discount
    const validSubTotal = validItems.reduce(
      (acc, item) => acc + item.finalPrice * item.quantity,
      0
    );

    if (offer.discountType === "FLAT") {
      couponDiscount = offer.discountValue;
    } else if (offer.discountType === "PERCENTAGE") {
      couponDiscount = Math.floor((validSubTotal * offer.discountValue) / 100);
      if (offer.maxDiscountAmount && couponDiscount > offer.maxDiscountAmount) {
        couponDiscount = offer.maxDiscountAmount;
      }
    }

    couponCode = offer.code;
    couponDescription = offer.description || "";
    offerId = offer._id;
  }

  const totalAmount = parseFloat(
    (subTotal + deliveryCharge - couponDiscount).toFixed(2)
  );

  const orderItems = items.map((item) => ({
    productId: item.productId,
    sellerId: item.sellerId,
    quantity: item.quantity,
    price: item.price,
    finalPrice: item.finalPrice,
    deliveryStatus: "processing",
    deliveryPartner,
    deliveryCharge: 0,
    commission: 0,
  }));

  const order = new Order({
    userId,
    items: orderItems,
    shippingAddress,
    subTotal,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
    isPaid: false,
    couponCode,
    couponDiscount,
    couponDescription,
    offerId,
  });

  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  // Find order with product & seller populated
  const order = await Order.findById(orderId)
    .populate("userId", "name email")
    .populate({
      path: "items.productId",
      select: "name image brand category",
      populate: [
        { path: "brand", model: Brand, select: "name logo" },
        { path: "category", model: Category, select: "name" },
      ],
    })
    .populate("items.sellerId", "shopName shopImage location")
    .select("-__v");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Access control (user only)
  if (order.userId._id.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access this order" });
  }

  // Format clean Amazon-style response
  const formattedOrder = {
    orderId: order._id,
    user: {
      name: order.userId.name,
      email: order.userId.email,
    },
    shippingAddress: order.shippingAddress,
    payment: {
      method: order.paymentMethod,
      status: order.paymentStatus,
      isPaid: order.isPaid,
    },
    coupon: {
      code: order.couponCode,
      discount: order.couponDiscount,
      description: order.couponDescription,
    },
    orderStatus: order.orderStatus,
    timestamps: {
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    },
    items: order.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.image?.[0] || null,
      brand: item.productId.brand?.name || null,
      brandLogo: item.productId.brand?.logo || null,
      category: item.productId.category?.name || null,
      quantity: item.quantity,
      price: item.price,
      finalPrice: item.finalPrice,
      total: item.finalPrice * item.quantity,
      deliveryStatus: item.deliveryStatus,
      deliveryPartner: item.deliveryPartner,
      trackingId: item.deliveryTrackingId,
      expectedDeliveryDate: item.expectedDeliveryDate,
      seller: {
        shopName: item.sellerId?.shopName || "",
        shopImage: item.sellerId?.shopImage || "",
        location: item.sellerId?.location || "",
      },
    })),
    pricing: {
      subTotal: order.subTotal,
      deliveryCharge: order.totalAmount - order.subTotal + order.couponDiscount,
      discount: order.couponDiscount,
      totalAmount: order.totalAmount,
    },
  };

  res.status(200).json({
    success: true,
    order: formattedOrder,
  });
});

export const getOrderTimeline = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findById(orderId).select("timeline userId");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Allow user access only to their own order
  if (order.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    success: true,
    timeline: order.timeline,
  });
});

export const getSellerOrderHistory = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // ✅ Step 1: Find seller by userId
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const sellerId = seller._id;

  // ✅ Step 2: Build filters
  const {
    page = 1,
    limit = 10,
    orderStatus,
    paymentStatus,
    productId,
    from,
    to,
  } = req.query;

  const skip = (page - 1) * limit;

  // ✅ Step 3: Seller's product IDs
  const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
  const productIds = sellerProducts.map((p) => p._id);

  const matchStage = {
    "items.productId": { $in: productIds },
  };

  if (orderStatus) {
    matchStage.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    matchStage.paymentStatus = paymentStatus;
  }

  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    matchStage["items.productId"] = mongoose.Types.ObjectId(productId);
  }

  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }

  // ✅ Step 4: Total count
  const totalOrders = await Order.countDocuments(matchStage);

  // ✅ Step 5: Fetch orders
  const orders = await Order.find(matchStage)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("userId", "name email")
    .populate("items.productId", "name image")
    .select("userId items totalAmount paymentStatus orderStatus createdAt");

  // ✅ Step 6: Format per seller
  const formattedOrders = [];

  for (const order of orders) {
    const filteredItems = order.items.filter((item) =>
      productIds.some((pid) => pid.toString() === item.productId._id.toString())
    );

    if (filteredItems.length === 0) continue; // skip irrelevant orders

    const formattedOrder = {
      orderId: order._id,
      customer: {
        name: order.userId?.name || "N/A",
        email: order.userId?.email || "N/A",
      },
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      items: filteredItems.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        productImage: item.productId.image?.[0],
        quantity: item.quantity,
        finalPrice: item.finalPrice,
        total: item.finalPrice * item.quantity,
        deliveryStatus: item.deliveryStatus,
      })),
    };

    formattedOrders.push(formattedOrder);
  }
  res.status(200).json({
    success: true,
    totalOrders,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalOrders / limit),
    orders: formattedOrders,
  });
});

// Cancel order by user
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.userId.toString() !== userId.toString())
    return res.status(403).json({ message: "Unauthorized" });

  if (order.orderStatus === "cancelled")
    return res.status(400).json({ message: "Order already cancelled" });

  if (["shipped", "in_transit", "delivered"].includes(order.orderStatus)) {
    return res
      .status(400)
      .json({ message: "Cannot cancel after shipping has started" });
  }

  // ✅ Handle Refund if Paid Online
  let refundInfo = null;
  if (order.paymentStatus === "paid" && order.paymentMethod !== "COD") {
    // TODO: call refund API here (Cashfree/Stripe etc.)
    refundInfo = {
      refundStatus: "initiated",
      refundedAt: new Date(),
    };
    // You could also store refund txn ID here
  }

  // ✅ Mark cancelled
  order.orderStatus = "cancelled";
  order.cancelledAt = new Date();
  await order.save();

  res.status(200).json({
    message: "Order cancelled successfully",
    refund: refundInfo,
  });
});
