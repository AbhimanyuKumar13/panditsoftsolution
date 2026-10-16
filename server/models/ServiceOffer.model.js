import mongoose from "mongoose";

const ServiceOfferSchema = new mongoose.Schema(
  {
    key: { type: String, default: "current", unique: true },
    isActive: { type: Boolean, default: false },
    title: { type: String, default: "", trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true, maxlength: 300 },
    label: { type: String, default: "", trim: true, maxlength: 50 },
    ctaText: { type: String, default: "Contact Us", trim: true, maxlength: 40 },
    ctaLink: { type: String, default: "/Contact", trim: true, maxlength: 120 },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceOffer", ServiceOfferSchema);
