const normalizeCertificateCode = (value = "") =>
  value.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

const normalizeStudentId = (value = "") =>
  value.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

export { normalizeCertificateCode, normalizeStudentId };
