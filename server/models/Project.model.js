import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Client Project", "Company Product"],
      default: "Client Project",
    },
    tag: { type: String, trim: true, maxlength: 80, default: "" },
    title: { type: String, trim: true, maxlength: 140, default: "" },
    problem: { type: String, trim: true, maxlength: 1500, default: "" },
    solution: { type: String, trim: true, maxlength: 1500, default: "" },
    result: { type: String, trim: true, maxlength: 1500, default: "" },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    link: { type: String, trim: true, default: "", maxlength: 500 },
    screenshots: {
      type: [{ type: String, trim: true, maxlength: 1000 }],
      default: [],
      validate: [(items) => items.length <= 20, "Maximum 20 screenshots allowed."],
    },
    status: { type: String, trim: true, maxlength: 80, default: "" },
    isPublished: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
