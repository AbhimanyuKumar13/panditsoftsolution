import HomeStats from "../models/HomeStats.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const validStat = (stat) =>
  stat &&
  typeof stat.id === "string" &&
  stat.id.trim().length > 0 &&
  stat.id.trim().length <= 40 &&
  Number.isInteger(stat.value) &&
  stat.value >= 0 &&
  stat.value <= 1000000 &&
  typeof stat.label === "string" &&
  stat.label.trim().length > 0 &&
  stat.label.trim().length <= 80 &&
  typeof stat.suffix === "string" &&
  stat.suffix.length <= 12;

const serializeStats = (document) =>
  document.stats.map((stat) => ({
    id: stat.id,
    value: stat.value,
    label: stat.label,
    suffix: stat.suffix,
  }));

export const listHomeStats = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const document = await HomeStats.findOne({ id: "main" }).lean();
  if (!document) {
    return res.status(503).json({ error: "Homepage statistics are not available." });
  }
  return res.json({ stats: serializeStats(document) });
});

export const updateHomeStats = asyncRoute(async (req, res) => {
  const { stats } = req.body || {};
  if (
    !Array.isArray(stats) ||
    stats.length !== 3 ||
    !stats.every(validStat) ||
    new Set(stats.map((stat) => stat.id)).size !== stats.length
  ) {
    return res.status(400).json({ error: "Provide valid values, labels, and suffixes for all three homepage statistics." });
  }

  const document = await HomeStats.findOne({ id: "main" });
  if (!document) {
    return res.status(503).json({ error: "Homepage statistics are not available." });
  }

  const existingIds = document.stats.map((stat) => stat.id);
  const submittedIds = stats.map((stat) => stat.id);
  if (
    existingIds.length !== submittedIds.length ||
    existingIds.some((id) => !submittedIds.includes(id))
  ) {
    return res.status(400).json({ error: "Only the existing homepage statistics can be edited." });
  }

  document.stats = stats.map(({ id, value, label, suffix }) => ({
    id,
    value,
    label: label.trim(),
    suffix: suffix.trim(),
  }));
  await document.save();
  return res.json({ success: true, stats: serializeStats(document) });
});
