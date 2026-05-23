import express from "express";
import { verifyCertificate } from "../controllers/certificate.controller.js";
import { certificateVerifyLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/verify", certificateVerifyLimiter, verifyCertificate);

export default router;
