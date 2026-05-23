import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    studentIdNormalized: { type: String, required: true, trim: true },
    certificateNo: { type: String, required: true, trim: true },
    certificateNoNormalized: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    courseName: { type: String, required: true, trim: true },
    courseStartDate: { type: Date, required: true },
    courseEndDate: { type: Date, required: true },
    issuedOn: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

CertificateSchema.index({ certificateNoNormalized: 1, studentIdNormalized: 1 });

export default mongoose.model("Certificate", CertificateSchema);
