import express from "express";
import { listPublicTrainingCourses } from "../controllers/trainingCourse.controller.js";

const router = express.Router();

router.get("/", listPublicTrainingCourses);

export default router;
