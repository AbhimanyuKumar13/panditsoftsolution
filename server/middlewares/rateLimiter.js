import rateLimit from "express-rate-limit";

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const certificateVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  message: {
    error: "Too many verification attempts. Please try again in a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many sign-in attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminRecoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: { error: "Too many recovery attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const ownerBootstrapLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many owner setup attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
