import Offer from "../models/offerModel.js";

// Create Offer
export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build filter condition
    const searchRegex = new RegExp(search, "i"); // i = case-insensitive
    const filter = {
      $or: [{ code: searchRegex }, { description: searchRegex }],
    };

    // Total count for pagination
    const totalOffers = await Offer.countDocuments(filter);

    // Paginated + filtered data
    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      offers,
      totalCount: totalOffers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOffers / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update offer
export const updateOffer = async (req, res) => {
  try {
    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete offer
export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
