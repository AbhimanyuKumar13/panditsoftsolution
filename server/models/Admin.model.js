import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["owner", "admin"], required: true },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true },
);

AdminSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: "owner" } },
);

export default mongoose.model("Admin", AdminSchema);
