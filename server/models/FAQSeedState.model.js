import mongoose from "mongoose";

const FAQSeedStateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "main" },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("FAQSeedState", FAQSeedStateSchema);
