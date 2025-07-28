import CashfreeSDK from "cashfree-pg-sdk-nodejs";

import axios from "axios";

const CF_BASE_URL = "https://sandbox.cashfree.com/pg/orders"; // use live URL in production
const CF_HEADERS = {
  "Content-Type": "application/json",
  "x-api-version": "2022-09-01",
  "x-client-id": process.env.CASHFREE_CLIENT_ID,
  "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
};

const cf = new CashfreeSDK({
  clientId: process.env.CF_CLIENT_ID,
  clientSecret: process.env.CF_CLIENT_SECRET,
  stage: "TEST" // or "PROD"
});

export const createCashfreeOrder = async ({ orderId, amount, currency, customer, splits }) => {
  const res = await axios.post(
    CF_BASE_URL,
    {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: customer,
      order_splits: splits, // array of { vendor_id, amount }
    },
    { headers: CF_HEADERS }
  );

  return res.data;
};

export const verifyWebhook = (headers, body) => {
  return cf.webhooks.verify(headers["x-webhook-signature"], body);
};
