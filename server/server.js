import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contact.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import confirmationLetterRoutes from "./routes/confirmationLetter.routes.js";
import syncConfirmationLetterSeeds from "./data/syncConfirmationLetterSeeds.js";
import syncServiceCatalog from "./data/syncServiceCatalog.js";
import syncHomeReviews from "./data/syncHomeReviews.js";
import syncHomeStats from "./data/syncHomeStats.js";
import syncTrainingCourses from "./data/syncTrainingCourses.js";
import syncFAQs from "./data/syncFAQs.js";

import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes.js";
import projectRoutes from "./routes/project.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import serviceCatalogRoutes from "./routes/serviceCatalog.routes.js";
import homeReviewsRoutes from "./routes/homeReviews.routes.js";
import homeStatsRoutes from "./routes/homeStats.routes.js";
import trainingCourseRoutes from "./routes/trainingCourse.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import { getAdminConfig } from "./utils/adminSecurity.js";

const app = express();

const allowedOrigins = getAdminConfig().clientOrigins;

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "X-Admin-Request"],
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());

app.use("/api/contact", contactRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/confirmation-letters", confirmationLetterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/service-catalog", serviceCatalogRoutes);
app.use("/api/home-reviews", homeReviewsRoutes);
app.use("/api/home-stats", homeStatsRoutes);
app.use("/api/courses", trainingCourseRoutes);
app.use("/api/faqs", faqRoutes);

app.get("/", (req, res) => {
  res.send("PanditSoftSolution API running");
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error.message);
  const status =
    error.code === 11000
      ? 409
      : error.name === "ValidationError" ||
          error.name === "CastError" ||
          error.type === "entity.parse.failed"
        ? 400
        : Number.isInteger(error.status)
          ? error.status
          : 500;
  return res.status(status).json({
    error:
      error.code === 11000
        ? "A record with that value already exists."
        : status === 400
          ? "Request data is invalid."
        : status < 500
          ? "Request could not be processed."
          : "The server could not complete the request.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await syncConfirmationLetterSeeds();
    await syncServiceCatalog();
    console.log("Service catalog seed sync complete");
    await syncHomeReviews();
    console.log("Homepage review seed sync complete");
    await syncHomeStats();
    console.log("Homepage stats seed sync complete");
    await syncTrainingCourses();
    console.log("Training course seed sync complete");
    await syncFAQs();
    console.log("FAQ seed sync complete");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
