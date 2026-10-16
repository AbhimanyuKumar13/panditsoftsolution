import mongoose from "mongoose";

const StatSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 40 },
    value: { type: Number, required: true, min: 0, max: 1000000 },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    suffix: { type: String, trim: true, maxlength: 12, default: "+" },
  },
  { _id: false },
);

const HomeStatsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "main" },
    stats: {
      type: [StatSchema],
      required: true,
      validate: [(items) => items.length === 3, "Provide all three homepage statistics."],
    },
  },
  { timestamps: true },
);

export default mongoose.model("HomeStats", HomeStatsSchema);
