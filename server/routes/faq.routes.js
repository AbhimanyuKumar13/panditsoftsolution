import express from "express";
import { listPublicFAQs } from "../controllers/faq.controller.js";

const router = express.Router();

router.get("/", listPublicFAQs);

export default router;
