import ConfirmationLetter from "../models/ConfirmationLetter.model.js";
import {
  normalizePersonName,
  normalizeReferenceCode,
} from "../utils/certificate.utils.js";

const buildConfirmationLetterResponse = (confirmationLetter) => ({
  candidateName: confirmationLetter.candidateName,
  referenceNo: confirmationLetter.referenceNo,
  programName: confirmationLetter.programName,
  technology: confirmationLetter.technology,
  durationLabel: confirmationLetter.durationLabel,
  sessionYear: confirmationLetter.sessionYear,
  supervisorName: confirmationLetter.supervisorName,
  issuedOn: confirmationLetter.issuedOn,
  status: confirmationLetter.status,
});

export const verifyConfirmationLetter = async (req, res) => {
  const { referenceNo = "", candidateName = "" } = req.body || {};

  if (!referenceNo.trim() || !candidateName.trim()) {
    return res.status(400).json({
      error: "Reference number and candidate name are required.",
    });
  }

  try {
    const confirmationLetter = await ConfirmationLetter.findOne({
      referenceNoNormalized: normalizeReferenceCode(referenceNo),
      candidateNameNormalized: normalizePersonName(candidateName),
      status: "active",
    }).lean();

    if (!confirmationLetter) {
      return res.status(404).json({
        error:
          "Record not found. Please check the reference number and candidate name.",
      });
    }

    return res.status(200).json({
      success: true,
      confirmationLetter: buildConfirmationLetterResponse(confirmationLetter),
    });
  } catch (error) {
    console.error("Confirmation letter verification failed:", error);
    return res.status(500).json({
      error: "Unable to verify the record right now.",
    });
  }
};
