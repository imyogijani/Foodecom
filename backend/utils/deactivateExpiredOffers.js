import Offer from "../models/offerModel.js";

export const deactivateExpiredOffers = async () => {
  try {
    const now = new Date();

    await Offer.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { isActive: false }
    );

    console.log(" Expired offers deactivated");
  } catch (error) {
    console.error(" Error in deactivating offers:", error.message);
  }
};
