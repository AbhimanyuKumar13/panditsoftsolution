import express from "express";
import { verifyConfirmationLetter } from "../controllers/confirmationLetter.controller.js";
import { certificateVerifyLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/verify", certificateVerifyLimiter, verifyConfirmationLetter);

export default router;
