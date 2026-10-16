import { randomUUID } from "node:crypto";
import FAQ from "../models/FAQ.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const validText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const normalizeAnswer = (answer) => {
  if (typeof answer === "string") return [answer.trim()].filter(Boolean);
  if (!Array.isArray(answer) || answer.some((item) => typeof item !== "string")) {
    return null;
  }
  return answer.map((item) => item.trim()).filter(Boolean);
};

const serializeFAQ = (faq) => ({
  id: faq.id,
  question: faq.question,
  answer: faq.answer,
  isPublished: faq.isPublished,
  sortOrder: faq.sortOrder,
});

export const listPublicFAQs = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const faqs = await FAQ.find({ isPublished: true })
    .sort({ sortOrder: 1, _id: 1 })
    .lean();
  return res.json({ faqs: faqs.map(serializeFAQ) });
});

export const listAdminFAQs = asyncRoute(async (_req, res) => {
  const faqs = await FAQ.find().sort({ sortOrder: 1, _id: 1 }).lean();
  return res.json({ faqs: faqs.map(serializeFAQ) });
});

export const createFAQ = asyncRoute(async (req, res) => {
  const { question, answer, isPublished = true } = req.body || {};
  const normalizedAnswer = normalizeAnswer(answer);
  if (
    !validText(question, 240) ||
    !normalizedAnswer?.length ||
    normalizedAnswer.length > 20 ||
    normalizedAnswer.some((item) => !validText(item, 1000)) ||
    typeof isPublished !== "boolean"
  ) {
    return res.status(400).json({ error: "Provide a valid FAQ question, answer, and visibility." });
  }

  const lastFAQ = await FAQ.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
  const faq = await FAQ.create({
    id: randomUUID(),
    question: question.trim(),
    answer: normalizedAnswer,
    isPublished,
    sortOrder: (lastFAQ?.sortOrder ?? -1) + 1,
  });
  return res.status(201).json({ success: true, faq: serializeFAQ(faq.toObject()) });
});

export const updateFAQ = asyncRoute(async (req, res) => {
  const { question, answer, isPublished } = req.body || {};
  const fields = {};
  if (Object.hasOwn(req.body || {}, "question")) {
    if (!validText(question, 240)) {
      return res.status(400).json({ error: "Question must be 240 characters or fewer." });
    }
    fields.question = question.trim();
  }
  if (Object.hasOwn(req.body || {}, "answer")) {
    const normalizedAnswer = normalizeAnswer(answer);
    if (
      !normalizedAnswer?.length ||
      normalizedAnswer.length > 20 ||
      normalizedAnswer.some((item) => !validText(item, 1000))
    ) {
      return res.status(400).json({ error: "Provide 1 to 20 valid answer paragraphs or points." });
    }
    fields.answer = normalizedAnswer;
  }
  if (Object.hasOwn(req.body || {}, "isPublished")) {
    if (typeof isPublished !== "boolean") {
      return res.status(400).json({ error: "FAQ visibility must be true or false." });
    }
    fields.isPublished = isPublished;
  }
  if (!Object.keys(fields).length) {
    return res.status(400).json({ error: "Provide a question, answer, or visibility to update." });
  }

  const faq = await FAQ.findOneAndUpdate(
    { id: req.params.id },
    { $set: fields },
    { new: true, runValidators: true },
  ).lean();
  if (!faq) return res.status(404).json({ error: "FAQ was not found." });
  return res.json({ success: true, faq: serializeFAQ(faq) });
});

export const reorderFAQs = asyncRoute(async (req, res) => {
  const { ids } = req.body || {};
  if (
    !Array.isArray(ids) ||
    ids.some((id) => !validText(id, 80)) ||
    new Set(ids).size !== ids.length
  ) {
    return res.status(400).json({ error: "Provide a unique, ordered list of FAQ IDs." });
  }

  const currentFAQs = await FAQ.find().select("id").lean();
  const currentIds = currentFAQs.map((faq) => faq.id);
  if (
    currentIds.length !== ids.length ||
    currentIds.some((id) => !ids.includes(id))
  ) {
    return res.status(400).json({ error: "Reorder must include every existing FAQ exactly once." });
  }

  await FAQ.bulkWrite(
    ids.map((id, sortOrder) => ({
      updateOne: { filter: { id }, update: { $set: { sortOrder } } },
    })),
  );
  const faqs = await FAQ.find().sort({ sortOrder: 1, _id: 1 }).lean();
  return res.json({ success: true, faqs: faqs.map(serializeFAQ) });
});

export const deleteFAQ = asyncRoute(async (req, res) => {
  const faq = await FAQ.findOneAndDelete({ id: req.params.id }).lean();
  if (!faq) return res.status(404).json({ error: "FAQ was not found." });

  await FAQ.updateMany(
    { sortOrder: { $gt: faq.sortOrder } },
    { $inc: { sortOrder: -1 } },
  );
  return res.json({ success: true });
});
