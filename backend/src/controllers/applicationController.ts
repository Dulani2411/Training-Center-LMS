import { Request, Response } from "express";
import { createApplication, getAllApplications } from "../models/applicationModel";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure CV upload directory exists
const cvUploadDir = path.join(process.cwd(), "uploads", "cvs");
if (!fs.existsSync(cvUploadDir)) {
  fs.mkdirSync(cvUploadDir, { recursive: true });
}

// Multer storage for PDF CVs
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, cvUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `cv_${uniqueSuffix}${ext}`);
  },
});

export const uploadCV = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for CV upload."));
    }
  },
});

export const uploadCVController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CV file uploaded." });
  }

  const relativeUrl = `/uploads/cvs/${req.file.filename}`;
  return res.status(200).json({
    message: "CV uploaded successfully.",
    url: relativeUrl,
    filename: req.file.originalname,
  });
};

export const handleGoogleFormWebhook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // We expect the payload to be already formatted neatly by our Google Apps Script
    // Convert arrays/objects to JSON strings to store safely in DB
    const applicationData = {
      fullName: data.fullName,
      nameWithInitials: data.nameWithInitials,
      address: data.address,
      district: data.district,
      mobile: data.mobile,
      landline: data.landline || null,
      dob: data.dob,
      gender: data.gender,
      civilStatus: data.civilStatus,
      nic: data.nic,
      traineeNumber: data.traineeNumber || null,
      personalEmail: data.personalEmail || null,
      olYear: data.olYear,
      olResultsJSON: JSON.stringify(data.olResults || {}),
      alYear: data.alYear,
      alStream: data.alStream,
      alResultsJSON: JSON.stringify(data.alResults || {}),
      trainingPreference: data.trainingPreference,
      workExperienceJSON: JSON.stringify(data.workExperience || []),
      specialAchievements: data.specialAchievements || null,
      sportsAchievements: data.sportsAchievements || null,
      refereesJSON: JSON.stringify(data.referees || []),
      cvDriveLink: data.cvDriveLink || null
    };

    await createApplication(applicationData);
    
    res.status(200).json({ message: "Application received and saved." });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ message: "Failed to save application.", error: err.message });
  }
};

export const submitApplication = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // 1. Full Name validation (required, only letters and spaces)
    if (!data.fullName || !data.fullName.trim()) {
      return res.status(400).json({ message: "Full Name is required." });
    }
    if (!/^[A-Za-z\s]+$/.test(data.fullName.trim())) {
      return res.status(400).json({
        message: "Full Name cannot contain numbers or special characters. Only letters and spaces are allowed.",
      });
    }

    // 2. Name with Initials validation (required, only letters, periods, and spaces)
    if (!data.nameWithInitials || !data.nameWithInitials.trim()) {
      return res.status(400).json({ message: "Name with Initials is required." });
    }
    if (!/^[A-Za-z\s.]+$/.test(data.nameWithInitials.trim())) {
      return res.status(400).json({
        message: "Name with Initials cannot contain numbers or special characters. Only letters, dots, and spaces are allowed (e.g. W. N. Fernando).",
      });
    }

    // 3. Trainee Number validation (required, numeric digits only)
    if (!data.traineeNumber || !String(data.traineeNumber).trim()) {
      return res.status(400).json({ message: "Trainee Number is required." });
    }
    if (!/^\d+$/.test(String(data.traineeNumber).trim())) {
      return res.status(400).json({
        message: "Trainee Number must contain numbers only (e.g. 3212). Characters are not allowed.",
      });
    }

    // 4. NIC validation
    if (!data.nic || !data.nic.trim()) {
      return res.status(400).json({ message: "NIC is required." });
    }

    // 5. Mobile Phone Number validation (required, 10 digits starting with 0)
    if (!data.mobile || !data.mobile.trim()) {
      return res.status(400).json({ message: "Mobile Number is required." });
    }
    const cleanMobile = data.mobile.trim().replace(/[\s-]/g, "");
    if (!/^0\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number starting with 0 (e.g. 0771234567).",
      });
    }

    // 6. Personal Email / Gmail validation (required, valid email address)
    if (!data.personalEmail || !data.personalEmail.trim()) {
      return res.status(400).json({ message: "Email address is required." });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.personalEmail.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address (e.g. user@gmail.com).",
      });
    }

    const applicationData = {
      fullName: data.fullName.trim(),
      nameWithInitials: data.nameWithInitials.trim(),
      address: data.address || "",
      district: data.district || "",
      mobile: data.mobile.trim(),
      landline: data.landline || null,
      dob: data.dob,
      gender: data.gender || "Not Specified",
      civilStatus: data.civilStatus || "Single",
      nic: data.nic.trim(),
      traineeNumber: String(data.traineeNumber).trim(),
      personalEmail: data.personalEmail ? data.personalEmail.trim() : null,
      olYear: data.olYear || "",
      olResultsJSON: typeof data.olResults === "string" ? data.olResults : JSON.stringify(data.olResults || {}),
      alYear: data.alYear || "",
      alStream: data.alStream || "",
      alResultsJSON: typeof data.alResults === "string" ? data.alResults : JSON.stringify(data.alResults || {}),
      trainingPreference: data.trainingPreference || "",
      workExperienceJSON: typeof data.workExperience === "string" ? data.workExperience : JSON.stringify(data.workExperience || []),
      specialAchievements: data.specialAchievements || null,
      sportsAchievements: data.sportsAchievements || null,
      refereesJSON: typeof data.referees === "string" ? data.referees : JSON.stringify(data.referees || []),
      cvDriveLink: data.cvDriveLink ? data.cvDriveLink.trim() : null
    };

    await createApplication(applicationData);

    return res.status(201).json({ message: "Application submitted successfully." });
  } catch (err: any) {
    console.error("submitApplication error:", err);
    return res.status(500).json({ message: "Failed to submit application.", error: err.message });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const apps = await getAllApplications();
    res.status(200).json(apps);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch applications.", error: err.message });
  }
};

export const deleteApplicationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid application ID." });
    }
    
    const { deleteApplication } = await import("../models/applicationModel");
    const success = await deleteApplication(id);
    if (success) {
      res.status(200).json({ message: "Application deleted successfully." });
    } else {
      res.status(404).json({ message: "Application not found." });
    }
  } catch (err: any) {
    res.status(500).json({ message: "Failed to delete application.", error: err.message });
  }
};
