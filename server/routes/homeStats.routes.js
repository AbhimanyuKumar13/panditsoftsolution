import express from "express";
import { listHomeStats } from "../controllers/homeStats.controller.js";

const router = express.Router();

router.get("/", listHomeStats);

export default router;
