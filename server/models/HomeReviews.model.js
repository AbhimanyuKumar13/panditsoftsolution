import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 60 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    badge: { type: String, required: true, trim: true, maxlength: 80 },
    meta: { type: String, required: true, trim: true, maxlength: 160 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    timeAgo: { type: String, required: true, trim: true, maxlength: 80 },
    avatar: { type: String, required: true, trim: true, maxlength: 12 },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { _id: false },
);

const HomeReviewsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "main" },
    reviews: {
      type: [ReviewSchema],
      required: true,
      validate: [(items) => items.length <= 12, "Provide no more than 12 reviews."],
    },
  },
  { timestamps: true },
);

export default mongoose.model("HomeReviews", HomeReviewsSchema);
