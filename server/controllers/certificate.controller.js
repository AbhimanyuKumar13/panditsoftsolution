import Certificate from "../models/Certificate.model.js";
import {
  normalizeCertificateCode,
  normalizeStudentId,
} from "../utils/certificate.utils.js";

const buildCertificateResponse = (certificate) => ({
  studentName: certificate.studentName,
  studentId: certificate.studentId,
  certificateNo: certificate.certificateNo,
  courseName: certificate.courseName,
  courseStartDate: certificate.courseStartDate,
  courseEndDate: certificate.courseEndDate,
  issuedOn: certificate.issuedOn || certificate.courseEndDate,
  status: certificate.status,
});

export const verifyCertificate = async (req, res) => {
  const { certificateNo = "", studentId = "" } = req.body || {};

  if (!certificateNo.trim() || !studentId.trim()) {
    return res.status(400).json({
      error: "Certificate number and student ID are required.",
    });
  }

  try {
    const certificate = await Certificate.findOne({
      certificateNoNormalized: normalizeCertificateCode(certificateNo),
      studentIdNormalized: normalizeStudentId(studentId),
      status: "active",
    }).lean();

    if (!certificate) {
      return res.status(404).json({
        error:
          "Record not found. Please check the certificate number and student ID.",
      });
    }

    return res.status(200).json({
      success: true,
      certificate: buildCertificateResponse(certificate),
    });
  } catch (error) {
    console.error("Certificate verification failed:", error);
    return res.status(500).json({
      error: "Unable to verify the record right now.",
    });
  }
};
