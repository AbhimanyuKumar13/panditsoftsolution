import certificateSeeds from "./certificateSeeds.js";
import Certificate from "../models/Certificate.model.js";
import {
  normalizeCertificateCode,
  normalizeStudentId,
} from "../utils/certificate.utils.js";

const syncCertificateSeeds = async () => {
  if (!certificateSeeds.length) {
    return;
  }

  const operations = certificateSeeds.map((certificate) => {
    const certificateNo = certificate.certificateNo.trim().toUpperCase();
    const studentId = certificate.studentId.trim();

    return {
      updateOne: {
        filter: {
          certificateNoNormalized: normalizeCertificateCode(certificateNo),
        },
        update: {
          $set: {
            ...certificate,
            certificateNo,
            certificateNoNormalized: normalizeCertificateCode(certificateNo),
            studentId,
            studentIdNormalized: normalizeStudentId(studentId),
            studentName: certificate.studentName.trim(),
            courseName: certificate.courseName.trim(),
            status: certificate.status || "active",
          },
          $unset: {
            documentFileName: "",
            previewFileName: "",
          },
        },
        upsert: true,
      },
    };
  });

  await Certificate.bulkWrite(operations);
  console.log(
    `Certificate seed sync complete (${certificateSeeds.length} records)`
  );
};

export default syncCertificateSeeds;
