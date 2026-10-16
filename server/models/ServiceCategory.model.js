import mongoose from "mongoose";

const PackageTierSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 60 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    timeline: { type: String, required: true, trim: true, maxlength: 120 },
    features: {
      type: [{ type: String, trim: true, maxlength: 160 }],
      default: [],
      validate: [(items) => items.length <= 30, "Maximum 30 package features allowed."],
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const ServiceCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 60,
    },
    label: { type: String, required: true, trim: true, maxlength: 100 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    tiers: { type: [PackageTierSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceCategory", ServiceCategorySchema);
