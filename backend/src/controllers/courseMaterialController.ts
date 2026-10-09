import { type Request, type Response } from "express";
import path from "path";
import fs from "fs";
import {
  getMaterialsByCourse,
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  ensureCourseMaterialsTable,
} from "../models/courseMaterialModel";
import multer from "multer";

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "materials");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

export const uploadMaterial = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg", "image/png",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word, PowerPoint, and image files are allowed."));
    }
  },
});

// GET /api/materials?courseId=x
export const getMaterials = async (req: Request, res: Response) => {
  try {
    await ensureCourseMaterialsTable();
    const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : null;
    const items = courseId
      ? await getMaterialsByCourse(courseId)
      : await getAllMaterials();
    return res.status(200).json(items);
  } catch (err) {
    console.error("❌ getMaterials error:", err);
    return res.status(500).json({ message: "Error fetching materials." });
  }
};

// POST /api/materials  (with file upload)
export const addMaterial = async (req: Request, res: Response) => {
  try {
    await ensureCourseMaterialsTable();
    const { courseId, title, description, linkUrl, uploadedBy } = req.body;
    if (!courseId || !title || (!req.file && !linkUrl)) {
      return res.status(400).json({ message: "courseId, title, and a file or link are required." });
    }

    let fileUrl: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (req.file) {
      fileName = req.file.originalname;
      fileUrl = `/uploads/materials/${req.file.filename}`;
      const mime = req.file.mimetype;
      if (mime === "application/pdf") fileType = "pdf";
      else if (mime.includes("word")) fileType = "word";
      else if (mime.includes("presentation") || mime.includes("powerpoint")) fileType = "ppt";
      else fileType = "other";
    }

    const item = await createMaterial({
      courseId: parseInt(courseId),
      title,
      description,
      linkUrl: linkUrl || undefined,
      fileUrl,
      fileName,
      fileType,
      uploadedBy: uploadedBy ?? "Superadmin",
    });
    return res.status(201).json(item);
  } catch (err) {
    console.error("❌ addMaterial error:", err);
    return res.status(500).json({ message: "Error creating material." });
  }
};

// PUT /api/materials/:id
export const editMaterial = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    const existing = await getMaterialById(id);
    if (!existing) return res.status(404).json({ message: "Material not found." });
    const { title, description, linkUrl } = req.body;
    const update: Parameters<typeof updateMaterial>[1] = { title, description, linkUrl };
    if (req.file) {
      const mime = req.file.mimetype;
      const fileType = mime === "application/pdf"
        ? "pdf"
        : mime.includes("word")
          ? "word"
          : mime.includes("presentation") || mime.includes("powerpoint")
            ? "ppt"
            : "other";
      update.fileUrl = `/uploads/materials/${req.file.filename}`;
      update.fileName = req.file.originalname;
      update.fileType = fileType;
      update.linkUrl = linkUrl;
    }
    await updateMaterial(id, update);
    return res.status(200).json({ message: "Updated." });
  } catch (err) {
    console.error("❌ editMaterial error:", err);
    return res.status(500).json({ message: "Error updating material." });
  }
};

// DELETE /api/materials/:id
export const removeMaterial = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    await deleteMaterial(id);
    return res.status(200).json({ message: "Deleted." });
  } catch (err) {
    console.error("❌ removeMaterial error:", err);
    return res.status(500).json({ message: "Error deleting material." });
  }
};
