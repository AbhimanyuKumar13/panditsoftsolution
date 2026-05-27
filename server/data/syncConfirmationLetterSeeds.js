import confirmationLetterSeeds from "./confirmationLetterSeeds.js";
import ConfirmationLetter from "../models/ConfirmationLetter.model.js";
import {
  normalizePersonName,
  normalizeReferenceCode,
} from "../utils/certificate.utils.js";

const syncConfirmationLetterSeeds = async () => {
  if (!confirmationLetterSeeds.length) {
    return;
  }

  const operations = confirmationLetterSeeds.map((confirmationLetter) => {
    const referenceNo = confirmationLetter.referenceNo.trim().toUpperCase();
    const candidateName = confirmationLetter.candidateName.trim();

    return {
      updateOne: {
        filter: {
          referenceNoNormalized: normalizeReferenceCode(referenceNo),
        },
        update: {
          $set: {
            ...confirmationLetter,
            referenceNo,
            referenceNoNormalized: normalizeReferenceCode(referenceNo),
            candidateName,
            candidateNameNormalized: normalizePersonName(candidateName),
            programName: confirmationLetter.programName.trim(),
            technology: confirmationLetter.technology.trim(),
            durationLabel: confirmationLetter.durationLabel.trim(),
            supervisorName: confirmationLetter.supervisorName.trim(),
            sessionYear: Number(confirmationLetter.sessionYear),
            status: confirmationLetter.status || "active",
          },
        },
        upsert: true,
      },
    };
  });

  await ConfirmationLetter.bulkWrite(operations);
  console.log(
    `Confirmation letter seed sync complete (${confirmationLetterSeeds.length} records)`
  );
};

export default syncConfirmationLetterSeeds;
