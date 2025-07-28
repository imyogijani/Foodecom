import axios from "axios";
import Seller from "../models/sellerModel.js";

//  API: `POST /api/seller/create-cashfree-beneficiary`

// #### 📥 Request Input (from seller registration form):
// ```json
// {
//   "beneId": "SELLER123",            // Unique per seller
//   "name": "Ramesh Vendor",
//   "email": "ramesh@example.com",
//   "phone": "9876543210",
//   "bankAccount": "123456789012",
//   "ifsc": "HDFC0001234",
//   "address1": "Rajkot, Gujarat"
// }
// ```

export const createCashfreeBeneficiary = async (req, res) => {
  try {
    const seller = req.body;

    // Step 1: Call Cashfree Beneficiary API
    const response = await axios.post(
      "https://payout-api.cashfree.com/payout/v1.2/beneficiaries",
      seller,
      {
        headers: {
          "X-Client-Id": process.env.CASHFREE_CLIENT_ID,
          "X-Client-Secret": process.env.CASHFREE_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== "SUCCESS") {
      return res.status(400).json({ error: "Failed to create beneficiary" });
    }

    // Step 2: Store `beneId` in Seller model
    await Seller.findByIdAndUpdate(req.user._id, {
      cashfreeBeneId: seller.beneId,
    });

    res
      .status(200)
      .json({ message: "Cashfree beneficiary created", data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
