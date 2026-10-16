import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
    question: { type: String, required: true, trim: true, maxlength: 240 },
    answer: {
      type: [{ type: String, trim: true, maxlength: 1000 }],
      required: true,
      validate: [
        (items) => items.length > 0 && items.length <= 20,
        "Provide 1 to 20 answer paragraphs or points.",
      ],
    },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("FAQ", FAQSchema);
