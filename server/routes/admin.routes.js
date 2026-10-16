import express from "express";
import {
  bootstrapOwner,
  getSession,
  getOwnerSetupStatus,
  login,
  logout,
  requestOwnerPasswordReset,
  resetOwnerPassword,
} from "../controllers/adminAuth.controller.js";
import {
  createAdmin,
  deleteAdmin,
  listAdmins,
  updateAdminPassword,
  updateAdminStatus,
} from "../controllers/adminAccounts.controller.js";
import {
  createCertificate,
  listAdminCertificates,
  updateCertificateStatus,
} from "../controllers/adminCertificate.controller.js";
import {
  createAdminConfirmationLetter,
  listAdminConfirmationLetters,
  updateAdminConfirmationLetterStatus,
} from "../controllers/adminConfirmationLetter.controller.js";
import { uploadProjectScreenshots } from "../controllers/adminUpload.controller.js";
import {
  createProject,
  deleteProject,
  listAdminProjects,
  updateProject,
} from "../controllers/project.controller.js";
import {
  deleteOffer,
  getAdminOffer,
  updateOffer,
} from "../controllers/serviceOffer.controller.js";
import {
  listHomeReviews,
  updateHomeReviews,
} from "../controllers/homeReviews.controller.js";
import {
  listHomeStats,
  updateHomeStats,
} from "../controllers/homeStats.controller.js";
import {
  deleteTrainingCourse,
  listAdminTrainingCourses,
  updateTrainingCourse,
} from "../controllers/trainingCourse.controller.js";
import {
  listAdminContacts,
  updateAdminContactStatus,
} from "../controllers/adminContact.controller.js";
import {
  createFAQ,
  deleteFAQ,
  listAdminFAQs,
  reorderFAQs,
  updateFAQ,
} from "../controllers/faq.controller.js";
import {
  createPackageTier,
  createService,
  createServiceCategory,
  listAdminServiceCatalog,
  updatePackageTier,
  updateService,
  updateServiceCategory,
} from "../controllers/serviceCatalog.controller.js";
import {
  requireAdmin,
  requireAdminConfiguration,
  requireAdminOrigin,
  requireOwner,
} from "../middlewares/adminAuth.js";
import {
  adminLoginLimiter,
  adminRecoveryLimiter,
  ownerBootstrapLimiter,
} from "../middlewares/rateLimiter.js";
import multer from "multer";

const router = express.Router();
const ownerOnly = [requireAdminOrigin, requireAdmin, requireOwner];
const authenticated = [requireAdminOrigin, requireAdmin];
const screenshotUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 20 },
});
const handleScreenshotUpload = (req, res, next) => {
  screenshotUpload.array("screenshots", 12)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Each screenshot must be 8 MB or smaller."
          : "Upload up to 20 screenshots at a time.";
      return res.status(400).json({ error: message });
    }
    return next(error);
  });
};

router.use(requireAdminConfiguration);

router.post(
  "/auth/owner/bootstrap",
  ownerBootstrapLimiter,
  bootstrapOwner,
);
router.get("/auth/owner/setup-status", requireAdminOrigin, getOwnerSetupStatus);
router.post("/auth/login", requireAdminOrigin, adminLoginLimiter, login);
router.post(
  "/auth/owner/forgot-password",
  requireAdminOrigin,
  adminRecoveryLimiter,
  requestOwnerPasswordReset,
);
router.post(
  "/auth/owner/reset-password",
  requireAdminOrigin,
  adminRecoveryLimiter,
  resetOwnerPassword,
);
router.post("/auth/logout", ...authenticated, logout);
router.get("/auth/session", ...authenticated, getSession);

router.get("/admins", ...ownerOnly, listAdmins);
router.post("/admins", ...ownerOnly, createAdmin);
router.patch("/admins/:id/password", ...ownerOnly, updateAdminPassword);
router.patch("/admins/:id/status", ...ownerOnly, updateAdminStatus);
router.delete("/admins/:id", ...ownerOnly, deleteAdmin);

router.get("/projects", ...authenticated, listAdminProjects);
router.post("/projects", ...authenticated, createProject);
router.patch("/projects/:id", ...authenticated, updateProject);
router.delete("/projects/:id", ...authenticated, deleteProject);

router.get("/certificates", ...authenticated, listAdminCertificates);
router.post("/certificates", ...authenticated, createCertificate);
router.patch(
  "/certificates/:id/status",
  ...authenticated,
  updateCertificateStatus,
);
router.get("/confirmation-letters", ...authenticated, listAdminConfirmationLetters);
router.post("/confirmation-letters", ...authenticated, createAdminConfirmationLetter);
router.patch(
  "/confirmation-letters/:id/status",
  ...authenticated,
  updateAdminConfirmationLetterStatus,
);
router.post(
  "/uploads/project-screenshots",
  ...authenticated,
  handleScreenshotUpload,
  uploadProjectScreenshots,
);

router.get("/offer", ...authenticated, getAdminOffer);
router.put("/offer", ...authenticated, updateOffer);
router.delete("/offer", ...authenticated, deleteOffer);

router.get("/home-reviews", ...authenticated, listHomeReviews);
router.put("/home-reviews", ...authenticated, updateHomeReviews);
router.get("/home-stats", ...authenticated, listHomeStats);
router.put("/home-stats", ...authenticated, updateHomeStats);
router.get("/courses", ...authenticated, listAdminTrainingCourses);
router.patch("/courses/:id", ...authenticated, updateTrainingCourse);
router.delete("/courses/:id", ...authenticated, deleteTrainingCourse);

router.get("/contacts", ...authenticated, listAdminContacts);
router.patch("/contacts/:id/status", ...authenticated, updateAdminContactStatus);

router.get("/faqs", ...authenticated, listAdminFAQs);
router.post("/faqs", ...authenticated, createFAQ);
router.patch("/faqs/reorder", ...authenticated, reorderFAQs);
router.patch("/faqs/:id", ...authenticated, updateFAQ);
router.delete("/faqs/:id", ...authenticated, deleteFAQ);

router.get("/service-catalog", ...authenticated, listAdminServiceCatalog);
router.post("/service-catalog/categories", ...authenticated, createServiceCategory);
router.patch("/service-catalog/categories/:id", ...authenticated, updateServiceCategory);
router.post("/service-catalog/categories/:id/packages", ...authenticated, createPackageTier);
router.patch(
  "/service-catalog/categories/:id/packages/:packageId",
  ...authenticated,
  updatePackageTier,
);
router.post("/service-catalog/services", ...authenticated, createService);
router.patch("/service-catalog/services/:id", ...authenticated, updateService);

export default router;
