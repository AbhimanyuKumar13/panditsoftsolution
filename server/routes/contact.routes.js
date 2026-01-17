import express from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { contactLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/", contactLimiter, submitContact);

export default router;
