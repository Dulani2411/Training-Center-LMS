import { type Request, type Response } from "express";
import {
  getAllMarks,
  getMarksByStudent,
  getMarksByCourse,
  createMark,
  updateMark,
  deleteMark,
  ensureStudentMarksTable,
} from "../models/studentMarkModel";

// GET /api/marks?studentId=x or ?courseId=x
export const getMarks = async (req: Request, res: Response) => {
  try {
    await ensureStudentMarksTable();
    const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : null;
    const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : null;

    let items;
    if (studentId) items = await getMarksByStudent(studentId);
    else if (courseId) items = await getMarksByCourse(courseId);
    else items = await getAllMarks();

    return res.status(200).json(items);
  } catch (err) {
    console.error("❌ getMarks error:", err);
    return res.status(500).json({ message: "Error fetching marks." });
  }
};

// POST /api/marks
export const addMark = async (req: Request, res: Response) => {
  try {
    await ensureStudentMarksTable();
    const { studentId, courseId, subject, mark, grade, remarks, addedBy } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "studentId and courseId are required." });
    }
    const item = await createMark({ studentId, courseId, subject, mark, grade, remarks, addedBy });
    return res.status(201).json(item);
  } catch (err) {
    console.error("❌ addMark error:", err);
    return res.status(500).json({ message: "Error adding mark." });
  }
};

// PUT /api/marks/:id
export const editMark = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    const { mark, grade, remarks } = req.body;
    await updateMark(id, { mark, grade, remarks });
    return res.status(200).json({ message: "Updated." });
  } catch (err) {
    console.error("❌ editMark error:", err);
    return res.status(500).json({ message: "Error updating mark." });
  }
};

// DELETE /api/marks/:id
export const removeMark = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID." });
    await deleteMark(id);
    return res.status(200).json({ message: "Deleted." });
  } catch (err) {
    console.error("❌ removeMark error:", err);
    return res.status(500).json({ message: "Error deleting mark." });
  }
};
