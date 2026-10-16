import express from "express";
import { listPublicProjects } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", listPublicProjects);

export default router;
