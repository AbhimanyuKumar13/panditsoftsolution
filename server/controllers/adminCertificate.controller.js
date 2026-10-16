import Certificate from "../models/Certificate.model.js";
import {
  normalizeCertificateCode,
  normalizeStudentId,
} from "../utils/certificate.utils.js";
import asyncRoute from "../utils/asyncRoute.js";

const requiredText = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validDate = (value) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

export const listAdminCertificates = asyncRoute(async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const pageSize =
    req.query.pageSize === undefined ? 10 : Number(req.query.pageSize);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    ![5, 10, 20].includes(pageSize)
  ) {
    return res.status(400).json({
      error: "Page must be positive and page size must be 5, 10, or 20.",
    });
  }

  const total = await Certificate.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const certificates = await Certificate.find()
    .sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean();
  return res.json({
    certificates,
    pagination: { page: currentPage, pageSize, total, totalPages },
  });
});

export const createCertificate = asyncRoute(async (req, res) => {
  const {
    studentName,
    studentId,
    certificateNo,
    courseName,
    courseStartDate,
    courseEndDate,
    issuedOn,
  } = req.body || {};

  if (
    !requiredText(studentName) ||
    !requiredText(studentId) ||
    !requiredText(certificateNo) ||
    !requiredText(courseName) ||
    !validDate(courseStartDate) ||
    !validDate(courseEndDate) ||
    (issuedOn && !validDate(issuedOn))
  ) {
    return res.status(400).json({
      error:
        "Provide student name, student ID, unique certificate number, course, and valid course dates.",
    });
  }

  if (Date.parse(courseEndDate) < Date.parse(courseStartDate)) {
    return res.status(400).json({
      error: "Course end date must be on or after the start date.",
    });
  }

  const normalizedCertificateNo = normalizeCertificateCode(certificateNo);
  if (
    await Certificate.exists({
      certificateNoNormalized: normalizedCertificateNo,
    })
  ) {
    return res.status(409).json({ error: "Certificate number already exists." });
  }

  const certificate = await Certificate.create({
    studentName: studentName.trim(),
    studentId: studentId.trim(),
    studentIdNormalized: normalizeStudentId(studentId),
    certificateNo: certificateNo.trim().toUpperCase(),
    certificateNoNormalized: normalizedCertificateNo,
    courseName: courseName.trim(),
    courseStartDate,
    courseEndDate,
    issuedOn: issuedOn || courseEndDate,
    status: "active",
  });

  return res.status(201).json({ success: true, certificate });
});

export const updateCertificateStatus = asyncRoute(async (req, res) => {
  const { status } = req.body || {};
  if (!["active", "revoked"].includes(status)) {
    return res.status(400).json({ error: "Status must be active or revoked." });
  }

  const certificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();

  if (!certificate) {
    return res.status(404).json({ error: "Certificate was not found." });
  }
  return res.json({ success: true, certificate });
});
