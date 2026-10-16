import HomeReviews from "../models/HomeReviews.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const validText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const validReview = (review) =>
  review &&
  validText(review.id, 60) &&
  validText(review.name, 120) &&
  validText(review.badge, 80) &&
  validText(review.meta, 160) &&
  Number.isInteger(review.rating) &&
  review.rating >= 1 &&
  review.rating <= 5 &&
  validText(review.timeAgo, 80) &&
  validText(review.avatar, 12) &&
  validText(review.text, 2000);

const serializeReviews = (document) =>
  document.reviews.map((review) => ({
    id: review.id,
    name: review.name,
    badge: review.badge,
    meta: review.meta,
    rating: review.rating,
    timeAgo: review.timeAgo,
    avatar: review.avatar,
    text: review.text,
  }));

export const listHomeReviews = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const document = await HomeReviews.findOne({ id: "main" }).lean();
  if (!document) {
    return res.status(503).json({ error: "Homepage reviews are not available." });
  }
  return res.json({ reviews: serializeReviews(document) });
});

export const updateHomeReviews = asyncRoute(async (req, res) => {
  const { reviews } = req.body || {};
  if (
    !Array.isArray(reviews) ||
    reviews.length > 12 ||
    !reviews.every(validReview) ||
    new Set(reviews.map((review) => review.id)).size !== reviews.length
  ) {
    return res.status(400).json({
      error: "Provide valid details for up to 12 unique homepage reviews.",
    });
  }

  const document = await HomeReviews.findOne({ id: "main" });
  if (!document) {
    return res.status(503).json({ error: "Homepage reviews are not available." });
  }

  document.reviews = reviews;
  await document.save();
  return res.json({ success: true, reviews: serializeReviews(document) });
});
