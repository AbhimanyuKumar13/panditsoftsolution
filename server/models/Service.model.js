import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 60,
    },
    packageCategory: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 60,
    },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    desc: { type: String, required: true, trim: true, maxlength: 500 },
    points: {
      type: [{ type: String, trim: true, maxlength: 160 }],
      default: [],
      validate: [(items) => items.length <= 20, "Maximum 20 service points allowed."],
    },
    icon: {
      type: String,
      enum: ["FiGlobe", "FiMonitor", "FiShoppingBag", "FiLayout", "FiServer", "FiActivity"],
      default: "FiLayout",
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Service", ServiceSchema);
