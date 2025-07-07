import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const createOffer = async (req, res) => {
  try {
    const { shop, product, title, description, discount, price } = req.body;
    if (!shop || !product || !title || !discount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const offer = new Offer({
      shop,
      product,
      title,
      description,
      discount,
      price,
      startDate: new Date(),
      endDate: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
      active: true,
    });
    await offer.save();
    res.status(201).json({ success: true, offer });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ active: true })
      .populate("shop", "shopName names email")
      .populate("product", "name image price");
    res.json({ success: true, offers });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getShops = async (req, res) => {
  try {
    const shops = await User.find(
      { role: "shopowner" },
      "shopName names email"
    );
    res.json({ shops });
  } catch (e) {
    res.status(500).json({ shops: [] });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    offer.active = false;
    await offer.save();
    res.json({ success: true, message: "Offer removed" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
