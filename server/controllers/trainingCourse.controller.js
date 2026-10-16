import TrainingCourse from "../models/TrainingCourse.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const validText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const parseStringList = (value, maxItems, maxLength, { allowEmpty = false } = {}) => {
  if (
    !Array.isArray(value) ||
    value.length > maxItems ||
    (!allowEmpty && value.length === 0) ||
    value.some((item) => !validText(item, maxLength))
  ) {
    return null;
  }
  return value.map((item) => item.trim());
};

const serializeCourse = (course) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  trackGroup: course.trackGroup,
  trackLabel: course.trackLabel,
  summary: course.summary,
  skillsPreview: course.skillsPreview,
  duration: course.duration,
  level: course.level,
  mode: course.mode,
  commitment: course.commitment,
  price: course.price,
  audience: course.audience,
  notFor: course.notFor,
  modules: course.modules,
  projects: course.projects,
  teachingMethod: course.teachingMethod,
  schedule: course.schedule,
  isActive: course.isActive,
});

const validateCourse = (body) => {
  const stringFields = [
    ["title", 160],
    ["trackLabel", 80],
    ["summary", 1000],
    ["duration", 80],
    ["level", 80],
    ["mode", 80],
    ["commitment", 80],
    ["price", 80],
  ];
  for (const [field, maxLength] of stringFields) {
    if (!validText(body[field], maxLength)) {
      return { error: `${field} must contain 1 to ${maxLength} characters.` };
    }
  }

  if (!["45 Days", "6 Months"].includes(body.trackGroup)) {
    return { error: "Choose a valid training track." };
  }
  if (typeof body.isActive !== "boolean") {
    return { error: "Course availability must be true or false." };
  }

  const skillsPreview = parseStringList(body.skillsPreview, 20, 80, { allowEmpty: true });
  const audience = parseStringList(body.audience, 30, 240, { allowEmpty: true });
  const notFor = parseStringList(body.notFor, 30, 240, { allowEmpty: true });
  const projects = parseStringList(body.projects, 30, 240, { allowEmpty: true });
  const teachingMethod = parseStringList(body.teachingMethod, 30, 240, { allowEmpty: true });
  if (!skillsPreview || !audience || !notFor || !projects || !teachingMethod) {
    return { error: "Check the course list fields; each line must be within its character limit." };
  }

  if (
    !Array.isArray(body.modules) ||
    body.modules.length === 0 ||
    body.modules.length > 30 ||
    body.modules.some(
      (module) =>
        !module ||
        !validText(module.title, 120) ||
        !parseStringList(module.topics, 30, 240),
    )
  ) {
    return { error: "Provide 1 to 30 modules, each with a title and at least one topic." };
  }

  if (
    !body.schedule ||
    !Number.isInteger(body.schedule.sessionsPerWeek) ||
    body.schedule.sessionsPerWeek < 1 ||
    body.schedule.sessionsPerWeek > 14 ||
    !validText(body.schedule.sessionDuration, 80) ||
    typeof body.schedule.recordings !== "boolean"
  ) {
    return { error: "Provide a valid weekly schedule and recording availability." };
  }

  return {
    data: {
      title: body.title.trim(),
      trackGroup: body.trackGroup,
      trackLabel: body.trackLabel.trim(),
      summary: body.summary.trim(),
      skillsPreview,
      duration: body.duration.trim(),
      level: body.level.trim(),
      mode: body.mode.trim(),
      commitment: body.commitment.trim(),
      price: body.price.trim(),
      audience,
      notFor,
      modules: body.modules.map((module) => ({
        title: module.title.trim(),
        topics: module.topics.map((topic) => topic.trim()),
      })),
      projects,
      teachingMethod,
      schedule: {
        sessionsPerWeek: body.schedule.sessionsPerWeek,
        sessionDuration: body.schedule.sessionDuration.trim(),
        recordings: body.schedule.recordings,
      },
      isActive: body.isActive,
    },
  };
};

export const listPublicTrainingCourses = asyncRoute(async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const courses = await TrainingCourse.find({
    isActive: true,
    isDeleted: { $ne: true },
  }).sort({ trackGroup: 1, title: 1 }).lean();
  return res.json({ courses: courses.map(serializeCourse) });
});

export const listAdminTrainingCourses = asyncRoute(async (_req, res) => {
  const courses = await TrainingCourse.find({ isDeleted: { $ne: true } })
    .sort({ trackGroup: 1, title: 1 })
    .lean();
  return res.json({ courses: courses.map(serializeCourse) });
});

export const updateTrainingCourse = asyncRoute(async (req, res) => {
  const { data, error } = validateCourse(req.body || {});
  if (error) return res.status(400).json({ error });

  const course = await TrainingCourse.findOne({
    id: req.params.id,
    isDeleted: { $ne: true },
  });
  if (!course) return res.status(404).json({ error: "Training course was not found." });

  Object.assign(course, data);
  await course.save();
  return res.json({ success: true, course: serializeCourse(course.toObject()) });
});

export const deleteTrainingCourse = asyncRoute(async (req, res) => {
  const course = await TrainingCourse.findOneAndUpdate(
    { id: req.params.id, isDeleted: { $ne: true } },
    { $set: { isActive: false, isDeleted: true } },
    { new: true },
  ).select("id");
  if (!course) return res.status(404).json({ error: "Training course was not found." });
  return res.json({ success: true, id: course.id });
});
