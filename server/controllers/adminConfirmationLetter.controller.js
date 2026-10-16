import ConfirmationLetter from "../models/ConfirmationLetter.model.js";
import {
  normalizePersonName,
  normalizeReferenceCode,
} from "../utils/certificate.utils.js";
import asyncRoute from "../utils/asyncRoute.js";

const validText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const validDate = (value) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

export const listAdminConfirmationLetters = asyncRoute(async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const pageSize =
    req.query.pageSize === undefined ? 10 : Number(req.query.pageSize);
  if (!Number.isInteger(page) || page < 1 || ![5, 10, 20].includes(pageSize)) {
    return res.status(400).json({
      error: "Page must be positive and page size must be 5, 10, or 20.",
    });
  }

  const total = await ConfirmationLetter.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const confirmationLetters = await ConfirmationLetter.find()
    .sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return res.json({
    confirmationLetters,
    pagination: { page: currentPage, pageSize, total, totalPages },
  });
});

export const createAdminConfirmationLetter = asyncRoute(async (req, res) => {
  const {
    candidateName,
    referenceNo,
    programName,
    technology,
    durationLabel,
    sessionYear,
    supervisorName,
    issuedOn,
  } = req.body || {};

  if (
    !validText(candidateName, 160) ||
    !validText(referenceNo, 100) ||
    !validText(programName, 160) ||
    !validText(technology, 120) ||
    !validText(durationLabel, 80) ||
    !Number.isInteger(Number(sessionYear)) ||
    Number(sessionYear) < 2000 ||
    Number(sessionYear) > 2200 ||
    !validText(supervisorName, 160) ||
    !validDate(issuedOn)
  ) {
    return res.status(400).json({
      error:
        "Provide a candidate, unique reference number, program, technology, duration, session year, supervisor, and valid issue date.",
    });
  }

  const normalizedReferenceNo = normalizeReferenceCode(referenceNo);
  if (!normalizedReferenceNo) {
    return res.status(400).json({ error: "Reference number must contain letters or numbers." });
  }
  if (await ConfirmationLetter.exists({ referenceNoNormalized: normalizedReferenceNo })) {
    return res.status(409).json({ error: "Confirmation letter reference number already exists." });
  }

  let confirmationLetter;
  try {
    confirmationLetter = await ConfirmationLetter.create({
      candidateName: candidateName.trim(),
      candidateNameNormalized: normalizePersonName(candidateName),
      referenceNo: referenceNo.trim().toUpperCase(),
      referenceNoNormalized: normalizedReferenceNo,
      programName: programName.trim(),
      technology: technology.trim(),
      durationLabel: durationLabel.trim(),
      sessionYear: Number(sessionYear),
      supervisorName: supervisorName.trim(),
      issuedOn,
      status: "active",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        error: "Confirmation letter reference number already exists.",
      });
    }
    throw error;
  }

  return res.status(201).json({ success: true, confirmationLetter });
});

export const updateAdminConfirmationLetterStatus = asyncRoute(
  async (req, res) => {
    const { status } = req.body || {};
    if (!["active", "revoked"].includes(status)) {
      return res.status(400).json({ error: "Status must be active or revoked." });
    }

    const confirmationLetter = await ConfirmationLetter.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true },
    ).lean();
    if (!confirmationLetter) {
      return res.status(404).json({ error: "Confirmation letter was not found." });
    }
    return res.json({ success: true, confirmationLetter });
  },
);
