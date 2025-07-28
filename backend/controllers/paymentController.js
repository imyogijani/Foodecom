import asyncHandler from "express-async-handler";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import { createCashfreeOrder, verifyWebhook } from "../utils/cashfreeAPI.js";
import { settleOrderPayout } from "./payoutController.js"; // Import the payout function


// export const initiatePayment = asyncHandler(async (req, res) => {
//   const { orderId } = req.body;
//   const order = await Order.findById(orderId);
//   if (!order) return res.status(404).json({ message: "Order not found" });

//   const cfOrder = await createCashfreeOrder({
//     orderId: order._id.toString(),
//     amount: order.totalAmount,
//     currency: order.currency || "INR",
//     customer: { id: req.user._id.toString(), email: req.user.email, phone: req.user.phone }
//   });

//   const payment = await Payment.create({
//     userId: req.user._id,
//     orderId: order._id,
//     amount: order.totalAmount,
//     method: req.body.method,
//     gateway: "Cashfree",
//     providerOrderId: cfOrder.id
//   });

//   res.json({ paymentSessionId: cfOrder.session_id, amount: order.totalAmount });
// });
// controllers/paymentController.js

export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;
  const order = await Order.findById(orderId).populate("items.productId");

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (method === "COD") {
    // just create record and exit
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order._id,
      amount: order.totalAmount,
      method: "COD",
      gateway: "COD",
      status: "pending",
    });

    return res.json({ cod: true, message: "COD order initiated" });
  }

  //  Calculate seller splits
  const sellerSplitMap = {}; // { sellerId: totalAmount }

  for (const item of order.items) {
    const sellerId = item.productId.sellerId.toString();
    sellerSplitMap[sellerId] =
      (sellerSplitMap[sellerId] || 0) + item.totalPrice;
  }

  const splits = await Promise.all(
    Object.entries(sellerSplitMap).map(async ([sellerId, amt]) => {
      const seller = await Seller.findById(sellerId);
      if (!seller || !seller.cashfreeVendorId)
        throw new Error("Seller not onboarded");
      return {
        vendor_id: seller.cashfreeBeneId,
        amount: amt.toFixed(2),
      };
    })
  );

  //  Create Cashfree Order with splits
  const cfOrder = await createCashfreeOrder({
    orderId: order._id.toString(),
    amount: order.totalAmount,
    currency: "INR",
    customer: {
      customer_id: req.user._id.toString(),
      customer_email: req.user.email,
      customer_phone: req.user.phone,
    },
    splits,
  });

  //  Save Payment
  const payment = await Payment.create({
    userId: req.user._id,
    orderId: order._id,
    amount: order.totalAmount,
    method,
    gateway: "Cashfree",
    providerOrderId: cfOrder.order_id,
  });

  res.json({
    paymentSessionId: cfOrder.payment_session_id,
    amount: order.totalAmount,
  });
});

export const paymentWebhook = asyncHandler(async (req, res) => {
  const valid = verifyWebhook(req.headers, req.body);
  if (!valid) return res.status(400).send("Invalid signature");

  const { order_id, order_status, order_amount, payment_id } = req.body;
  const payment = await Payment.findOne({ providerOrderId: order_id });

  if (!payment) return res.status(404).send("Payment not found");

  if (order_status === "PAID") {
    payment.status = "success";
    payment.providerPaymentId = payment_id;
    payment.paidAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.orderId);
    order.paymentStatus = "paid";
    order.isPaid = true;
    order.orderStatus = "confirmed";
      await order.save();
      
      
  //  Trigger async seller payout

    await settleOrderPayout(
      { params: { orderId: order._id } },
      { status: () => ({ json: () => {} }) }
    );
  } else {
    payment.status = "failed";
    await payment.save();
  }

  res.status(200).send("Webhook handled");
});
