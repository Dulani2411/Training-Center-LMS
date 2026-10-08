import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudentProfile,
  changePasswordOnFirstLoginController,
  getAllStudents,
  createStudentByAdmin,
  deleteStudentByAdmin,
  resetPasswordByAdmin,
  updateEnrolledCourseByAdmin,
  uploadStudentPhoto,
  uploadStudentPhotoController,
} from "../controllers/studentController";

const router = express.Router();

// ✅ Student Authentication Routes

// Register a new student / Set password
router.post("/register", registerStudent);

// Login student
router.post("/login", loginStudent);

// Change password on first login (required after initial login)
router.post("/change-password-first-login", changePasswordOnFirstLoginController);

// Get student profile (protected route)
router.get("/profile/:id", getStudentProfile);

// ✅ Admin Routes (no JWT middleware — frontend uses hardcoded admin auth)

// Get all students (admin)
router.get("/", getAllStudents);

// Create student by admin
router.post("/admin-create", createStudentByAdmin);

// Delete student by admin
router.delete("/:id", deleteStudentByAdmin);

// Reset student password by admin
router.post("/:id/reset-password", resetPasswordByAdmin);

// Update enrolled course by admin
router.post("/:id/update-course", updateEnrolledCourseByAdmin);
router.post("/:id/photo", (req, res, next) => {
  uploadStudentPhoto.single("photo")(req, res, (err: unknown) => {
    if (err) {
      console.error("❌ student photo upload middleware error:", err);
      return res.status(400).json({
        message: err instanceof Error ? err.message : "Invalid profile photo upload.",
      });
    }
    return uploadStudentPhotoController(req, res).catch(next);
  });
});

export default router;
