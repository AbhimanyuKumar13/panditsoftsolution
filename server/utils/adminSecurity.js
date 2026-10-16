import { createHmac, timingSafeEqual } from "node:crypto";

export const getAdminConfig = () => ({
  ownerEmail: process.env.OWNER_EMAIL?.trim().toLowerCase() || "",
  bootstrapCode: process.env.OWNER_BOOTSTRAP_CODE || "",
  jwtSecret: process.env.ADMIN_JWT_SECRET || "",
  otpSecret: process.env.ADMIN_OTP_SECRET || "",
  clientOrigins: (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean),
});

export const hasAdminSecrets = () => {
  const config = getAdminConfig();
  return Boolean(
    config.ownerEmail &&
      config.jwtSecret.length >= 32 &&
      config.otpSecret.length >= 32 &&
      config.clientOrigins.length,
  );
};

export const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export const hashOwnerOtp = (ownerId, code) => {
  const { otpSecret } = getAdminConfig();
  return createHmac("sha256", otpSecret)
    .update(`${ownerId}:${code}`)
    .digest("hex");
};

export const validatePassword = (password) =>
  typeof password === "string" &&
  password.length >= 12 &&
  Buffer.byteLength(password, "utf8") <= 72;

export const isSafeWebUrl = (value, allowRelative = true) => {
  if (typeof value !== "string" || value.length > 1000) {
    return false;
  }

  const input = value.trim();
  if (!input) {
    return true;
  }

  if (allowRelative && input.startsWith("/") && !input.startsWith("//")) {
    return !input.includes("\\");
  }

  try {
    const url = new URL(input);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export const adminUnavailable = (res) =>
  res.status(503).json({
    error:
      "Admin access is not configured. Set the required server environment variables.",
  });
