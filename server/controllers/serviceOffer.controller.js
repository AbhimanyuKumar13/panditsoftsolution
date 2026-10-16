import ServiceOffer from "../models/ServiceOffer.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const offerCtaText = "Contact Us";
const offerCtaLink = "/Contact";
const isValidDateOrEmpty = (value) =>
  value === "" || value === null || value === undefined ||
  (typeof value === "string" && !Number.isNaN(Date.parse(value)));

const serializeOffer = (offer) => ({
  isActive: offer.isActive,
  title: offer.title,
  description: offer.description,
  label: offer.label,
  ctaText: offerCtaText,
  ctaLink: offerCtaLink,
  startsAt: offer.startsAt,
  endsAt: offer.endsAt,
});

export const getCurrentOffer = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const offer = await ServiceOffer.findOne({ key: "current" }).lean();
  if (
    !offer ||
    !offer.isActive ||
    (offer.startsAt && offer.startsAt > new Date()) ||
    (offer.endsAt && offer.endsAt < new Date())
  ) {
    return res.json({ offer: null });
  }

  return res.json({ offer: serializeOffer(offer) });
});

export const getAdminOffer = asyncRoute(async (_req, res) => {
  const offer = await ServiceOffer.findOneAndUpdate(
    { key: "current" },
    { $setOnInsert: { isActive: false } },
    { upsert: true, new: true, runValidators: true },
  ).lean();
  return res.json({ offer: serializeOffer(offer) });
});

export const updateOffer = asyncRoute(async (req, res) => {
  const {
    isActive,
    title,
    description,
    label,
    startsAt,
    endsAt,
  } = req.body || {};

  if (
    typeof isActive !== "boolean" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof label !== "string" ||
    !isValidDateOrEmpty(startsAt) ||
    !isValidDateOrEmpty(endsAt)
  ) {
    return res.status(400).json({ error: "Offer fields are invalid." });
  }

  if (isActive && (!title.trim() || !description.trim())) {
    return res.status(400).json({
      error: "An active offer must include a title and description.",
    });
  }

  const startDate = startsAt ? new Date(startsAt) : null;
  const endDate = endsAt ? new Date(endsAt) : null;
  if (startDate && endDate && endDate <= startDate) {
    return res.status(400).json({ error: "Offer end date must follow its start date." });
  }

  const offer = await ServiceOffer.findOneAndUpdate(
    { key: "current" },
    {
      $set: {
        isActive,
        title: title.trim(),
        description: description.trim(),
        label: label.trim(),
        ctaText: offerCtaText,
        ctaLink: offerCtaLink,
        startsAt: startDate,
        endsAt: endDate,
        updatedBy: req.admin._id,
      },
    },
    { upsert: true, new: true, runValidators: true },
  ).lean();

  return res.json({ success: true, offer: serializeOffer(offer) });
});

export const deleteOffer = asyncRoute(async (_req, res) => {
  await ServiceOffer.findOneAndDelete({ key: "current" });
  return res.json({ success: true });
});
