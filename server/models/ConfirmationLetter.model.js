import mongoose from "mongoose";

const ConfirmationLetterSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true, trim: true },
    candidateNameNormalized: { type: String, required: true, trim: true },
    referenceNo: { type: String, required: true, trim: true },
    referenceNoNormalized: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    programName: { type: String, required: true, trim: true },
    technology: { type: String, required: true, trim: true },
    durationLabel: { type: String, required: true, trim: true },
    sessionYear: { type: Number, required: true },
    supervisorName: { type: String, required: true, trim: true },
    issuedOn: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

ConfirmationLetterSchema.index({
  referenceNoNormalized: 1,
  candidateNameNormalized: 1,
});

export default mongoose.model("ConfirmationLetter", ConfirmationLetterSchema);
