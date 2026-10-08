import express from "express";
import {
  handleGoogleFormWebhook,
  getApplications,
  submitApplication,
  uploadCV,
  uploadCVController,
  deleteApplicationController,
} from "../controllers/applicationController";

const router = express.Router();

// Direct form submission from LMS Frontend
router.post("/apply", submitApplication);
router.post("/submit", submitApplication);

// Upload CV file (PDF only)
router.post("/upload-cv", uploadCV.single("cv"), uploadCVController);

// Webhook for receiving Google Form submissions
router.post("/webhook", handleGoogleFormWebhook);

// Admin route to fetch all applications
router.get("/", getApplications);

// Admin route to delete application
router.delete("/:id", deleteApplicationController);

export default router;
