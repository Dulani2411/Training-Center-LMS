import express from "express";
import {
  getMarks,
  addMark,
  editMark,
  removeMark,
} from "../controllers/studentMarkController";

const router = express.Router();

router.get("/", getMarks);
router.post("/", addMark);
router.put("/:id", editMark);
router.delete("/:id", removeMark);

export default router;
