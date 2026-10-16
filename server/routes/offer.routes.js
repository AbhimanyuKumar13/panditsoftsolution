import express from "express";
import { getCurrentOffer } from "../controllers/serviceOffer.controller.js";

const router = express.Router();

router.get("/current", getCurrentOffer);

export default router;
