import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import {
  adminUnavailable,
  getAdminConfig,
  hasAdminSecrets,
} from "../utils/adminSecurity.js";

export const requireAdminConfiguration = (req, res, next) => {
  if (!hasAdminSecrets()) {
    return adminUnavailable(res);
  }

  return next();
};

export const requireAdminOrigin = (req, res, next) => {
  const { clientOrigins } = getAdminConfig();
  const origin = req.get("origin")?.replace(/\/$/, "");

  if (!origin || !clientOrigins.includes(origin)) {
    return res.status(403).json({ error: "Admin request origin is not allowed." });
  }

  if (req.get("x-admin-request") !== "1") {
    return res.status(403).json({ error: "Invalid admin request." });
  }

  return next();
};

export const requireAdmin = async (req, res, next) => {
  const token = req.cookies?.pss_admin_session;

  if (!token) {
    return res.status(401).json({ error: "Admin login is required." });
  }

  try {
    const { jwtSecret } = getAdminConfig();
    const payload = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    const admin = await Admin.findById(payload.sub).select(
      "+passwordHash email role isActive tokenVersion",
    );

    if (
      !admin ||
      !admin.isActive ||
      admin.tokenVersion !== payload.tokenVersion
    ) {
      res.clearCookie("pss_admin_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/api/admin",
      });
      return res.status(401).json({ error: "Admin session has expired." });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Admin session has expired." });
    }

    return next(error);
  }
};

export const requireOwner = (req, res, next) => {
  if (req.admin?.role !== "owner") {
    return res.status(403).json({ error: "Owner permission is required." });
  }

  return next();
};
