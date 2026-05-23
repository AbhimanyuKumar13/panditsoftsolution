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
