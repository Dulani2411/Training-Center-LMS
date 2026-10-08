import { type Request, type Response } from "express";
import {
  getAllAnnouncements,
  getAnnouncementsByCourse,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  ensureAnnouncementsTable,
} from "../models/announcementModel";

// GET /api/announcements?courseId=x
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    await ensureAnnouncementsTable();
    const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : null;
    const items = courseId
      ? await getAnnouncementsByCourse(courseId)
      : await getAllAnnouncements();
    return res.status(200).json(items);
  } catch (err) {
    console.error("❌ getAnnouncements error:", err);
    return res.status(500).json({ message: "Error fetching announcements." });
  }
};

// POST /api/announcements
export const addAnnouncement = async (req: Request, res: Response) => {
  try {
    await ensureAnnouncementsTable();
    const { title, content, courseId, createdByUsername } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required." });
    }
    const item = await createAnnouncement({ title, content, courseId: courseId ?? null, createdByUsername });
    return res.status(201).json(item);
  } catch (err) {
    console.error("❌ addAnnouncement error:", err);
    return res.status(500).json({ message: "Error creating announcement." });
  }
};

// PUT /api/announcements/:id
export const editAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    const { title, content, courseId } = req.body;
    const ok = await updateAnnouncement(id, { title, content, courseId });
    return res.status(200).json({ message: ok ? "Updated." : "Not found." });
  } catch (err) {
    console.error("❌ editAnnouncement error:", err);
    return res.status(500).json({ message: "Error updating announcement." });
  }
};

// DELETE /api/announcements/:id
export const removeAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    await deleteAnnouncement(id);
    return res.status(200).json({ message: "Deleted." });
  } catch (err) {
    console.error("❌ removeAnnouncement error:", err);
    return res.status(500).json({ message: "Error deleting announcement." });
  }
};
