import express from "express";
import { listPublicServiceCatalog } from "../controllers/serviceCatalog.controller.js";

const router = express.Router();

router.get("/", listPublicServiceCatalog);

export default router;
