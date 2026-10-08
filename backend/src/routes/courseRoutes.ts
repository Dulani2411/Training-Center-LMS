import express from "express";
import {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
} from "../controllers/courseController";

const router = express.Router();

// ✅ CRUD Routes for Courses

// Get all courses
router.get("/", getCourses);

// Get a single course by ID
router.get("/:id", getCourse);

// Create a new course
router.post("/", addCourse);

// Update an existing course
router.put("/:id", editCourse);

// Delete a course
router.delete("/:id", removeCourse);

export default router;
