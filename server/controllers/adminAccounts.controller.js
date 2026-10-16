import bcrypt from "bcryptjs";
import Admin from "../models/Admin.model.js";
import asyncRoute from "../utils/asyncRoute.js";
import { validatePassword } from "../utils/adminSecurity.js";

const BCRYPT_ROUNDS = 12;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicAdmin = (admin) => ({
  id: admin._id.toString(),
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  createdAt: admin.createdAt,
});

export const listAdmins = asyncRoute(async (req, res) => {
  const admins = await Admin.find({ role: "admin" })
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ admins: admins.map(publicAdmin) });
});

export const createAdmin = asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
    return res.status(400).json({ error: "Enter a valid admin email." });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Initial password must be 12–72 bytes long.",
    });
  }

  const admin = await Admin.create({
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    role: "admin",
    createdBy: req.admin._id,
  });

  return res.status(201).json({
    success: true,
    admin: publicAdmin(admin),
  });
});

const findManagedAdmin = async (id, res) => {
  const admin = await Admin.findOne({ _id: id, role: "admin" });
  if (!admin) {
    res.status(404).json({ error: "Admin account was not found." });
    return null;
  }
  return admin;
};

export const updateAdminPassword = asyncRoute(async (req, res) => {
  const admin = await findManagedAdmin(req.params.id, res);
  if (!admin) return;

  if (!validatePassword(req.body?.password)) {
    return res.status(400).json({
      error: "Password must be 12–72 bytes long.",
    });
  }

  admin.passwordHash = await bcrypt.hash(req.body.password, BCRYPT_ROUNDS);
  admin.tokenVersion += 1;
  await admin.save();

  return res.json({ success: true, message: "Admin password updated." });
});

export const updateAdminStatus = asyncRoute(async (req, res) => {
  const admin = await findManagedAdmin(req.params.id, res);
  if (!admin) return;

  if (typeof req.body?.isActive !== "boolean") {
    return res.status(400).json({ error: "isActive must be true or false." });
  }

  admin.isActive = req.body.isActive;
  if (!admin.isActive) admin.tokenVersion += 1;
  await admin.save();

  return res.json({ success: true, admin: publicAdmin(admin) });
});

export const deleteAdmin = asyncRoute(async (req, res) => {
  const admin = await findManagedAdmin(req.params.id, res);
  if (!admin) return;

  await Admin.deleteOne({ _id: admin._id, role: "admin" });
  return res.json({ success: true });
});
