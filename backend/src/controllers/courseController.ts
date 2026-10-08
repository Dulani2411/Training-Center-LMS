import { type Request, type Response } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  type Course,
} from "../models/courseModel";

// =============================================
// GET /api/courses
// =============================================
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await getAllCourses();
    return res.status(200).json(courses);
  } catch (err: unknown) {
    console.error("❌ getCourses error:", err);
    return res.status(500).json({ message: "Error fetching courses." });
  }
};

// =============================================
// GET /api/courses/:id
// =============================================
export const getCourse = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid course ID." });

    const course = await getCourseById(id);
    if (!course) return res.status(404).json({ message: "Course not found." });

    return res.status(200).json(course);
  } catch (err: unknown) {
    console.error("❌ getCourse error:", err);
    return res.status(500).json({ message: "Error fetching course." });
  }
};

// =============================================
// POST /api/courses
// =============================================
export const addCourse = async (req: Request, res: Response) => {
  try {
    const { courseName, description, duration, status } = req.body as Partial<Course>;

    if (!courseName) {
      return res.status(400).json({ message: "courseName is required." });
    }

    await createCourse({ courseName, description, duration, status });
    return res.status(201).json({ message: "Course created successfully." });
  } catch (err: unknown) {
    console.error("❌ addCourse error:", err);
    return res.status(500).json({ message: "Error creating course." });
  }
};

// =============================================
// PUT /api/courses/:id
// =============================================
export const editCourse = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid course ID." });

    const { courseName, description, duration, status } = req.body as Partial<Course>;
    await updateCourse(id, { courseName, description, duration, status });
    return res.status(200).json({ message: "Course updated successfully." });
  } catch (err: unknown) {
    console.error("❌ editCourse error:", err);
    return res.status(500).json({ message: "Error updating course." });
  }
};

// =============================================
// DELETE /api/courses/:id
// =============================================
export const removeCourse = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) return res.status(400).json({ message: "Invalid course ID." });

    await deleteCourse(id);
    return res.status(200).json({ message: "Course deleted successfully." });
  } catch (err: unknown) {
    console.error("❌ removeCourse error:", err);
    return res.status(500).json({ message: "Error deleting course." });
  }
};
