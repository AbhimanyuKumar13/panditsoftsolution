import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    topics: {
      type: [{ type: String, trim: true, maxlength: 240 }],
      required: true,
      validate: [(items) => items.length > 0 && items.length <= 30, "Provide 1 to 30 topics per module."],
    },
  },
  { _id: false },
);

const ScheduleSchema = new mongoose.Schema(
  {
    sessionsPerWeek: { type: Number, required: true, min: 1, max: 14 },
    sessionDuration: { type: String, required: true, trim: true, maxlength: 80 },
    recordings: { type: Boolean, required: true },
  },
  { _id: false },
);

const TrainingCourseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    trackGroup: { type: String, required: true, enum: ["45 Days", "6 Months"] },
    trackLabel: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 1000 },
    skillsPreview: {
      type: [{ type: String, trim: true, maxlength: 80 }],
      required: true,
      validate: [(items) => items.length <= 20, "Provide up to 20 skills."],
    },
    duration: { type: String, required: true, trim: true, maxlength: 80 },
    level: { type: String, required: true, trim: true, maxlength: 80 },
    mode: { type: String, required: true, trim: true, maxlength: 80 },
    commitment: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: String, required: true, trim: true, maxlength: 80 },
    audience: {
      type: [{ type: String, trim: true, maxlength: 240 }],
      required: true,
      validate: [(items) => items.length <= 30, "Provide up to 30 audience items."],
    },
    notFor: {
      type: [{ type: String, trim: true, maxlength: 240 }],
      required: true,
      validate: [(items) => items.length <= 30, "Provide up to 30 exclusions."],
    },
    modules: {
      type: [ModuleSchema],
      required: true,
      validate: [(items) => items.length > 0 && items.length <= 30, "Provide 1 to 30 course modules."],
    },
    projects: {
      type: [{ type: String, trim: true, maxlength: 240 }],
      required: true,
      validate: [(items) => items.length <= 30, "Provide up to 30 projects."],
    },
    teachingMethod: {
      type: [{ type: String, trim: true, maxlength: 240 }],
      required: true,
      validate: [(items) => items.length <= 30, "Provide up to 30 teaching methods."],
    },
    schedule: { type: ScheduleSchema, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("TrainingCourse", TrainingCourseSchema);
