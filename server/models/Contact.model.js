import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in-progress", "done"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);
