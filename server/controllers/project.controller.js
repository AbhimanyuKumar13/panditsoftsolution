import Project from "../models/Project.model.js";
import asyncRoute from "../utils/asyncRoute.js";
import { isSafeWebUrl } from "../utils/adminSecurity.js";

const fields = [
  "category",
  "tag",
  "title",
  "problem",
  "solution",
  "result",
  "location",
  "link",
  "screenshots",
  "status",
  "isPublished",
];

const validateProject = (body, partial = false) => {
  const data = {};
  for (const field of fields) {
    if (Object.hasOwn(body, field)) data[field] = body[field];
  }

  if (
    Object.hasOwn(data, "category") &&
    data.category &&
    !["Client Project", "Company Product"].includes(data.category)
  ) {
    return { error: "Choose a valid project category." };
  }
  if (Object.hasOwn(data, "category") && !data.category) {
    data.category = "Client Project";
  }

  const stringLimits = {
    tag: 80,
    title: 140,
    problem: 1500,
    solution: 1500,
    result: 1500,
    location: 120,
    status: 80,
  };
  for (const [field, maxLength] of Object.entries(stringLimits)) {
    if (Object.hasOwn(data, field)) {
      if (typeof data[field] !== "string") {
        return { error: `${field} must be text.` };
      }
      data[field] = data[field].trim();
      if (data[field].length > maxLength) {
        return { error: `${field} must be ${maxLength} characters or fewer.` };
      }
    }
  }

  if (Object.hasOwn(data, "link") && !isSafeWebUrl(data.link, false) && data.link) {
    return { error: "Project link must be a valid HTTP or HTTPS URL." };
  }

  if (
    Object.hasOwn(data, "screenshots") &&
    (!Array.isArray(data.screenshots) ||
      data.screenshots.length > 20 ||
      data.screenshots.some((url) => !isSafeWebUrl(url)))
  ) {
    return { error: "Screenshots must be up to 20 valid web or site-relative URLs." };
  }

  if (
    Object.hasOwn(data, "isPublished") &&
    typeof data.isPublished !== "boolean"
  ) {
    return { error: "isPublished must be true or false." };
  }

  return { data };
};

const serializeProject = (project) => ({
  ...project,
  id: project._id.toString(),
  _id: undefined,
  createdBy: undefined,
  __v: undefined,
});

export const listPublicProjects = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const items = await Project.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ projects: items.map(serializeProject) });
});

export const listAdminProjects = asyncRoute(async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const pageSize =
    req.query.pageSize === undefined ? 10 : Number(req.query.pageSize);
  if (!Number.isInteger(page) || page < 1 || ![5, 10, 20].includes(pageSize)) {
    return res.status(400).json({
      error: "Page must be positive and page size must be 5, 10, or 20.",
    });
  }

  const total = await Project.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const items = await Project.find()
    .sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean();
  return res.json({
    projects: items.map(serializeProject),
    pagination: { page: currentPage, pageSize, total, totalPages },
  });
});

export const createProject = asyncRoute(async (req, res) => {
  const { data, error } = validateProject(req.body || {});
  if (error) return res.status(400).json({ error });

  const project = await Project.create({
    ...data,
    createdBy: req.admin._id,
  });

  return res.status(201).json({
    success: true,
    project: serializeProject(project.toObject()),
  });
});

export const updateProject = asyncRoute(async (req, res) => {
  const { data, error } = validateProject(req.body || {}, true);
  if (error) return res.status(400).json({ error });
  if (!Object.keys(data).length) {
    return res.status(400).json({ error: "Provide at least one project field." });
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    { new: true, runValidators: true },
  ).lean();

  if (!project) return res.status(404).json({ error: "Project was not found." });
  return res.json({ success: true, project: serializeProject(project) });
});

export const deleteProject = asyncRoute(async (req, res) => {
  const result = await Project.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "Project was not found." });
  return res.json({ success: true });
});
