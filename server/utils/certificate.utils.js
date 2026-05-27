const normalizeAlphaNumericCode = (value = "") =>
  value.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

const normalizeCertificateCode = (value = "") =>
  normalizeAlphaNumericCode(value);

const normalizeReferenceCode = (value = "") =>
  normalizeAlphaNumericCode(value);

const normalizeStudentId = (value = "") =>
  normalizeAlphaNumericCode(value);

const normalizePersonName = (value = "") =>
  value
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

export {
  normalizeCertificateCode,
  normalizeReferenceCode,
  normalizeStudentId,
  normalizePersonName,
};
