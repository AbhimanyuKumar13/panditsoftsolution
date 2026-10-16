import Service from "../models/Service.model.js";
import ServiceCategory from "../models/ServiceCategory.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const serviceIcons = new Set([
  "FiGlobe",
  "FiMonitor",
  "FiShoppingBag",
  "FiLayout",
  "FiServer",
  "FiActivity",
]);

const toSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const validText = (value, maxLength, { optional = false } = {}) =>
  typeof value === "string" &&
  (optional || value.trim().length > 0) &&
  value.trim().length <= maxLength;

const validVisibility = (value) => typeof value === "boolean";

const parseStringList = (value, maxItems, maxLength) => {
  if (
    !Array.isArray(value) ||
    value.length > maxItems ||
    value.some((item) => !validText(item, maxLength))
  ) {
    return null;
  }
  return value.map((item) => item.trim()).filter(Boolean);
};

const serializeService = (item) => ({
  id: item.id,
  packageCategory: item.packageCategory,
  title: item.title,
  desc: item.desc,
  points: item.points,
  icon: item.icon,
  isActive: item.isActive,
  sortOrder: item.sortOrder,
});

const serializeCategory = (category, includeHiddenTiers = false) => ({
  id: category.id,
  label: category.label,
  isActive: category.isActive,
  sortOrder: category.sortOrder,
  tiers: category.tiers
    .filter((tier) => includeHiddenTiers || tier.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      summary: tier.summary,
      timeline: tier.timeline,
      features: tier.features,
      isActive: tier.isActive,
      sortOrder: tier.sortOrder,
    })),
});

export const listPublicServiceCatalog = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const [categories, services] = await Promise.all([
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1, id: 1 }).lean(),
    Service.find({ isActive: true }).sort({ sortOrder: 1, id: 1 }).lean(),
  ]);

  const packageCategories = categories
    .map((category) => serializeCategory(category))
    .filter((category) => category.tiers.length > 0);
  const visibleCategoryIds = new Set(packageCategories.map((item) => item.id));

  return res.json({
    services: services
      .filter((item) => visibleCategoryIds.has(item.packageCategory))
      .map(serializeService),
    packageCategories,
  });
});

export const listAdminServiceCatalog = asyncRoute(async (_req, res) => {
  const [categories, services] = await Promise.all([
    ServiceCategory.find().sort({ sortOrder: 1, id: 1 }).lean(),
    Service.find().sort({ sortOrder: 1, id: 1 }).lean(),
  ]);

  return res.json({
    services: services.map(serializeService),
    packageCategories: categories.map((item) => serializeCategory(item, true)),
  });
});

export const createServiceCategory = asyncRoute(async (req, res) => {
  const { label, isActive = true } = req.body || {};
  if (!validText(label, 100) || !validVisibility(isActive)) {
    return res.status(400).json({ error: "Provide a valid category name and visibility." });
  }

  const id = toSlug(label);
  if (!id) {
    return res.status(400).json({ error: "Category name must contain letters or numbers." });
  }
  if (await ServiceCategory.exists({ id })) {
    return res.status(409).json({ error: "A package category with that name already exists." });
  }

  const lastCategory = await ServiceCategory.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
  const category = await ServiceCategory.create({
    id,
    label: label.trim(),
    isActive,
    sortOrder: (lastCategory?.sortOrder ?? -1) + 1,
    tiers: [],
  });
  return res.status(201).json({
    success: true,
    category: serializeCategory(category.toObject(), true),
  });
});

export const updateServiceCategory = asyncRoute(async (req, res) => {
  const { label, isActive } = req.body || {};
  const fields = {};
  if (Object.hasOwn(req.body || {}, "label")) {
    if (!validText(label, 100)) {
      return res.status(400).json({ error: "Category name must be 100 characters or fewer." });
    }
    fields.label = label.trim();
  }
  if (Object.hasOwn(req.body || {}, "isActive")) {
    if (!validVisibility(isActive)) {
      return res.status(400).json({ error: "Category visibility must be true or false." });
    }
    fields.isActive = isActive;
  }
  if (!Object.keys(fields).length) {
    return res.status(400).json({ error: "Provide a category name or visibility." });
  }

  const category = await ServiceCategory.findOneAndUpdate(
    { id: req.params.id },
    { $set: fields },
    { new: true, runValidators: true },
  ).lean();
  if (!category) return res.status(404).json({ error: "Package category was not found." });
  return res.json({ success: true, category: serializeCategory(category, true) });
});

const validateTier = (body) => {
  const { name, price, summary, timeline, features, isActive = true } = body || {};
  const parsedFeatures = parseStringList(features, 30, 160);
  if (
    !validText(name, 80) ||
    !validText(price, 80) ||
    !validText(summary, 300) ||
    !validText(timeline, 120) ||
    !parsedFeatures ||
    !validVisibility(isActive)
  ) {
    return { error: "Provide valid package details, visibility, and up to 30 feature lines." };
  }

  return {
    data: {
      name: name.trim(),
      price: price.trim(),
      summary: summary.trim(),
      timeline: timeline.trim(),
      features: parsedFeatures,
      isActive,
    },
  };
};

export const createPackageTier = asyncRoute(async (req, res) => {
  const { data, error } = validateTier(req.body || {});
  if (error) return res.status(400).json({ error });
  const id = toSlug(data.name);
  if (!id) return res.status(400).json({ error: "Package name must contain letters or numbers." });

  const category = await ServiceCategory.findOne({ id: req.params.id });
  if (!category) return res.status(404).json({ error: "Package category was not found." });
  if (category.tiers.some((tier) => tier.id === id)) {
    return res.status(409).json({ error: "A package with that name already exists in this category." });
  }

  const sortOrder = category.tiers.reduce(
    (highest, tier) => Math.max(highest, tier.sortOrder),
    -1,
  ) + 1;
  category.tiers.push({ ...data, id, sortOrder });
  await category.save();
  return res.status(201).json({
    success: true,
    packageCategories: serializeCategory(category.toObject(), true),
  });
});

export const updatePackageTier = asyncRoute(async (req, res) => {
  const { data, error } = validateTier(req.body || {});
  if (error) return res.status(400).json({ error });

  const category = await ServiceCategory.findOne({ id: req.params.id });
  if (!category) return res.status(404).json({ error: "Package category was not found." });
  const tier = category.tiers.find((item) => item.id === req.params.packageId);
  if (!tier) return res.status(404).json({ error: "Package was not found." });
  Object.assign(tier, data);
  await category.save();
  return res.json({
    success: true,
    packageCategories: serializeCategory(category.toObject(), true),
  });
});

const validateService = async (body, { partial = false } = {}) => {
  const data = {};
  const fields = ["packageCategory", "title", "desc", "points", "icon", "isActive"];
  for (const field of fields) {
    if (Object.hasOwn(body, field)) data[field] = body[field];
  }

  const requiredFields = partial ? [] : ["packageCategory", "title", "desc"];
  for (const field of requiredFields) {
    if (!Object.hasOwn(data, field)) return { error: `${field} is required.` };
  }
  if (Object.hasOwn(data, "packageCategory")) {
    if (!validText(data.packageCategory, 60)) {
      return { error: "Choose a valid package category." };
    }
    data.packageCategory = data.packageCategory.trim().toLowerCase();
    if (!(await ServiceCategory.exists({ id: data.packageCategory }))) {
      return { error: "Choose an existing package category." };
    }
  }
  if (Object.hasOwn(data, "title")) {
    if (!validText(data.title, 100)) return { error: "Service name must be 100 characters or fewer." };
    data.title = data.title.trim();
  }
  if (Object.hasOwn(data, "desc")) {
    if (!validText(data.desc, 500)) return { error: "Service description must be 500 characters or fewer." };
    data.desc = data.desc.trim();
  }
  if (Object.hasOwn(data, "points")) {
    const points = parseStringList(data.points, 20, 160);
    if (!points) return { error: "Service points must contain up to 20 lines of 160 characters." };
    data.points = points;
  }
  if (Object.hasOwn(data, "icon")) {
    if (!serviceIcons.has(data.icon)) return { error: "Choose a valid service icon." };
  }
  if (Object.hasOwn(data, "isActive") && !validVisibility(data.isActive)) {
    return { error: "Service visibility must be true or false." };
  }

  return { data };
};

export const createService = asyncRoute(async (req, res) => {
  const { data, error } = await validateService(req.body || {});
  if (error) return res.status(400).json({ error });
  const id = toSlug(data.title);
  if (!id) return res.status(400).json({ error: "Service name must contain letters or numbers." });
  if (await Service.exists({ id })) {
    return res.status(409).json({ error: "A service with that name already exists." });
  }

  const lastService = await Service.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
  const service = await Service.create({
    ...data,
    id,
    icon: data.icon || "FiLayout",
    points: data.points || [],
    isActive: data.isActive ?? true,
    sortOrder: (lastService?.sortOrder ?? -1) + 1,
  });
  return res.status(201).json({ success: true, service: serializeService(service.toObject()) });
});

export const updateService = asyncRoute(async (req, res) => {
  const { data, error } = await validateService(req.body || {}, { partial: true });
  if (error) return res.status(400).json({ error });
  if (!Object.keys(data).length) {
    return res.status(400).json({ error: "Provide at least one service field." });
  }

  const service = await Service.findOneAndUpdate(
    { id: req.params.id },
    { $set: data },
    { new: true, runValidators: true },
  ).lean();
  if (!service) return res.status(404).json({ error: "Service was not found." });
  return res.json({ success: true, service: serializeService(service) });
});
