import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import OwnerPasswordReset from "../models/OwnerPasswordReset.model.js";
import transporter from "../config/mailer.js";
import asyncRoute from "../utils/asyncRoute.js";
import {
  adminUnavailable,
  getAdminConfig,
  hashOwnerOtp,
  safeEqual,
  validatePassword,
} from "../utils/adminSecurity.js";

const BCRYPT_ROUNDS = 12;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const accountResponse = (admin) => ({
  id: admin._id.toString(),
  email: admin.email,
  role: admin.role,
});

const setSessionCookie = (res, admin) => {
  const { jwtSecret } = getAdminConfig();
  const token = jwt.sign(
    { sub: admin._id.toString(), tokenVersion: admin.tokenVersion },
    jwtSecret,
    { algorithm: "HS256", expiresIn: "7d" },
  );

  res.cookie("pss_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: SESSION_DURATION_MS,
    path: "/api/admin",
  });
};

export const bootstrapOwner = asyncRoute(async (req, res) => {
  const { ownerEmail, bootstrapCode } = getAdminConfig();
  const { email, code, password } = req.body || {};

  if (bootstrapCode.length < 32) {
    return adminUnavailable(res);
  }

  if (!emailPattern.test(String(email || "")) || !validatePassword(password)) {
    return res.status(400).json({
      error: "Provide a valid owner email and a password of 12–72 bytes.",
    });
  }

  if (
    email.trim().toLowerCase() !== ownerEmail ||
    !safeEqual(code || "", bootstrapCode)
  ) {
    return res.status(403).json({ error: "Owner setup could not be authorized." });
  }

  if (await Admin.exists({ role: "owner" })) {
    return res.status(409).json({ error: "Owner account is already initialized." });
  }

  try {
    const owner = await Admin.create({
      email: ownerEmail,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      role: "owner",
    });

    return res.status(201).json({
      success: true,
      message: "Owner account created. Sign in at the private admin page.",
      account: accountResponse(owner),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Owner account is already initialized." });
    }
    throw error;
  }
});

export const getOwnerSetupStatus = asyncRoute(async (_req, res) => {
  const initialized = Boolean(await Admin.exists({ role: "owner" }));
  return res.json({ initialized });
});

export const login = asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({ error: "Enter a valid email and password." });
  }

  const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select(
    "+passwordHash",
  );
  const validPassword =
    admin && admin.isActive
      ? await bcrypt.compare(password, admin.passwordHash)
      : false;

  if (!validPassword) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }

  setSessionCookie(res, admin);
  return res.json({ success: true, account: accountResponse(admin) });
});

export const logout = asyncRoute(async (req, res) => {
  res.clearCookie("pss_admin_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/admin",
  });

  return res.json({ success: true });
});

export const getSession = asyncRoute(async (req, res) =>
  res.json({ account: accountResponse(req.admin) }),
);

export const requestOwnerPasswordReset = asyncRoute(async (req, res) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return res.status(503).json({
      error: "Owner email recovery is unavailable because mail is not configured.",
    });
  }

  const { ownerEmail } = getAdminConfig();
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  const owner = email === ownerEmail
    ? await Admin.findOne({ email: ownerEmail, role: "owner", isActive: true })
    : null;

  if (owner) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const codeHash = hashOwnerOtp(owner._id, code);

    await OwnerPasswordReset.findOneAndUpdate(
      { ownerId: owner._id },
      {
        ownerId: owner._id,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
      { upsert: true, new: true, runValidators: true },
    );

    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: ownerEmail,
        subject: "Pandit Soft Solution admin password reset code",
        text: `Your one-time admin password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
      });
    } catch (error) {
      await OwnerPasswordReset.deleteOne({ ownerId: owner._id });
      console.error(
        "Owner password reset email delivery failed:",
        error.code || "mail delivery error",
      );
      return res.status(502).json({
        error: "The verification email could not be sent. Check the server mail settings and try again.",
      });
    }

    const notificationEmail = process.env.MAIL_RECEIVER?.trim();
    if (notificationEmail) {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.MAIL_USER,
          to: notificationEmail,
          subject: "Admin password recovery requested",
          text: `A password recovery code was sent to the configured owner email at ${new Date().toISOString()}. The verification code is intentionally not included in this notification.`,
        });
      } catch (error) {
        console.error(
          "Owner password reset notification email failed:",
          error.code || "mail delivery error",
        );
      }
    } else {
      console.error(
        "Owner password reset notification email was not sent: MAIL_RECEIVER is not configured.",
      );
    }
  }

  return res.status(202).json({
    message:
      "If this email matches an active owner account already registered in the system, a verification code will be sent to that owner email. Check its inbox and spam folder.",
  });
});

export const resetOwnerPassword = asyncRoute(async (req, res) => {
  const { ownerEmail } = getAdminConfig();
  const { email, code, password } = req.body || {};

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "New password must be 12–72 bytes long.",
    });
  }

  if (
    typeof email !== "string" ||
    typeof code !== "string" ||
    !/^\d{6}$/.test(code) ||
    email.trim().toLowerCase() !== ownerEmail
  ) {
    return res.status(400).json({ error: "Reset code is invalid or expired." });
  }

  const owner = await Admin.findOne({
    email: ownerEmail,
    role: "owner",
    isActive: true,
  });
  if (!owner) {
    return res.status(400).json({ error: "Reset code is invalid or expired." });
  }

  const reset = await OwnerPasswordReset.findOne({
    ownerId: owner._id,
    expiresAt: { $gt: new Date() },
  }).select("+codeHash");

  if (!reset || reset.attempts >= 5) {
    return res.status(400).json({ error: "Reset code is invalid or expired." });
  }

  const providedHash = hashOwnerOtp(owner._id, code);
  if (!safeEqual(providedHash, reset.codeHash)) {
    reset.attempts += 1;
    await reset.save();
    return res.status(400).json({ error: "Reset code is invalid or expired." });
  }

  owner.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  owner.tokenVersion += 1;
  await owner.save();
  await OwnerPasswordReset.deleteOne({ _id: reset._id });

  return res.json({
    success: true,
    message: "Owner password updated. Sign in with the new password.",
  });
});
