import express from "express";
import { listHomeReviews } from "../controllers/homeReviews.controller.js";

const router = express.Router();

router.get("/", listHomeReviews);

export default router;
