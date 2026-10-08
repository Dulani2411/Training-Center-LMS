import express from "express";
import {
  getAnnouncements,
  addAnnouncement,
  editAnnouncement,
  removeAnnouncement,
} from "../controllers/announcementController";

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", addAnnouncement);
router.put("/:id", editAnnouncement);
router.delete("/:id", removeAnnouncement);

export default router;
