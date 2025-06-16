import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
    unique: true,
  },
  monthlyPrice: {
    type: String,
    required: true,
  },
  includedFeatures: {
    type: [String],
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
