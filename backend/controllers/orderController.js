import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import Cart from "../models/cartModal.js";
// import Order from "../models/orderModel.js";
import Deal from "../models/dealModel.js";
import Offer from "../models/offerModel.js";

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

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error: error.message,
    });
  }
};

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

      let finalPrice = product.price;
      const deal = await Deal.findOne({
        product: product._id,
        status: "active",
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (deal) {
        finalPrice = deal.dealPrice;
      }

      const quantity = item.quantity;
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
