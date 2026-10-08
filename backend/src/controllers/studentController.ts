import { type Request, type Response } from "express";
import {
  getStudentByEmail,
  getStudentById,
  getStudentByIdentifier,
  updateStudentPasswordByEmail,
  changePasswordOnFirstLogin,
  verifyPassword,
  type Student,
} from "../models/studentModel";
import jwt, { type SignOptions } from "jsonwebtoken";

// JWT_SECRET must come from .env — no hardcoded fallback
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in .env — server cannot start securely.");
  process.exit(1);
}

// =============================================
// POST /api/students/register
// First-time password setup for pre-added students
// =============================================
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, password, identifier, studentId } = req.body as {
      email?: string;
      password?: string;
      identifier?: string;
      studentId?: string;
    };

    const key = (identifier || studentId || email || "").trim();

    if (!key || !password) {
      return res.status(400).json({ message: "Registration number or email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await getStudentByIdentifier(key);
    if (!existing) {
      return res.status(404).json({
        message: "Student record not found. Please contact the administrator to register first.",
      });
    }

    const updated = await updateStudentPasswordByEmail(existing.email, password);
    if (!updated) {
      return res.status(500).json({ message: "Failed to set password. Please try again." });
    }

    const student = await getStudentById(existing.id!);
    if (!student) {
      return res.status(500).json({ message: "Error retrieving student after update." });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Password set successfully.",
      token,
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        enrolledCourse: student.enrolledCourse,
      },
    });
  } catch (err: unknown) {
    console.error("❌ registerStudent error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// POST /api/students/login
// =============================================
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { identifier, email, studentId, password } = req.body as {
      identifier?: string;
      email?: string;
      studentId?: string;
      password?: string;
    };

    const loginKey = (identifier || studentId || email || "").trim();

    if (!loginKey || !password) {
      return res.status(400).json({ message: "Registration number / Email and password are required." });
    }

    const student = await getStudentByIdentifier(loginKey);
    if (!student || !student.password) {
      return res.status(401).json({ message: "Invalid registration number/email or password." });
    }

    const valid = await verifyPassword(password, student.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid registration number/email or password." });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      requirePasswordChange: !student.isPasswordChanged,
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        enrolledCourse: student.enrolledCourse,
      },
    });
  } catch (err: unknown) {
    console.error("❌ loginStudent error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// GET /api/students/profile/:id
// =============================================
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Strip password before sending
    const { password, ...safe } = student as Required<Student>;
    return res.status(200).json(safe);
  } catch (err: unknown) {
    console.error("❌ getStudentProfile error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// POST /api/students/change-password-first-login
// =============================================
export const changePasswordOnFirstLoginController = async (req: Request, res: Response) => {
  try {
    const { studentId, newPassword, confirmPassword } = req.body as {
      studentId?: number;
      newPassword?: string;
      confirmPassword?: string;
    };

    if (!studentId || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "studentId, newPassword and confirmPassword are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const student = await getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const changed = await changePasswordOnFirstLogin(studentId, newPassword);
    if (!changed) {
      return res.status(500).json({ message: "Failed to change password. Please try again." });
    }

    return res.status(200).json({
      message: "Password changed successfully. You can now access the dashboard.",
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        enrolledCourse: student.enrolledCourse,
        isPasswordChanged: true,
      },
    });
  } catch (err: unknown) {
    console.error("❌ changePasswordOnFirstLoginController error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// GET /api/students  (Admin — list all students)
// =============================================
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const pool = (await import("../config/db")).getPool();
    const result = await pool
      .request()
      .query(
        "SELECT id, email, name, studentId, enrolledCourse, isPasswordChanged, createdAt FROM [dbo].[Students] ORDER BY createdAt DESC"
      );
    return res.status(200).json(result.recordset);
  } catch (err: unknown) {
    console.error("❌ getAllStudents error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// POST /api/students/admin-create  (Admin — create student)
// =============================================
export const createStudentByAdmin = async (req: Request, res: Response) => {
  try {
    const { email, name, studentId, tempPassword, enrolledCourse } = req.body as {
      email?: string;
      name?: string;
      studentId?: string;
      tempPassword?: string;
      enrolledCourse?: string;
    };

    if (!email || !tempPassword) {
      return res.status(400).json({ message: "Email and tempPassword are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (tempPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await getStudentByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "A student with this email already exists." });
    }

    const { createStudent } = await import("../models/studentModel");
    const student = await createStudent({ email, name, studentId, password: tempPassword, enrolledCourse });

    return res.status(201).json({
      message: "Student created successfully.",
      student,
    });
  } catch (err: unknown) {
    console.error("❌ createStudentByAdmin error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// DELETE /api/students/:id  (Admin — delete student)
// =============================================
export const deleteStudentByAdmin = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const dbModule = await import("../config/db");
    const pool = dbModule.getPool();
    const sql = dbModule.default;

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM [dbo].[Students] WHERE id = @id");

    return res.status(200).json({ message: "Student deleted successfully." });
  } catch (err: unknown) {
    console.error("❌ deleteStudentByAdmin error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// POST /api/students/:id/reset-password  (Admin — reset student password)
// =============================================
export const resetPasswordByAdmin = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const { newPassword } = req.body as { newPassword?: string };
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Set isPasswordChanged back to 0 so they are forced to change it again on next login
    const pool = (await import("../config/db")).getPool();
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool
      .request()
      .input("id", id)
      .input("password", hashedPassword)
      .query(`
        UPDATE [dbo].[Students]
        SET password = @password, isPasswordChanged = 0
        WHERE id = @id
      `);

    return res.status(200).json({ message: "Student password reset successfully." });
  } catch (err: unknown) {
    console.error("❌ resetPasswordByAdmin error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// =============================================
// POST /api/students/:id/update-course  (Admin — set enrolledCourse)
// =============================================
export const updateEnrolledCourseByAdmin = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id ?? "");
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const { enrolledCourse } = req.body as { enrolledCourse?: string };

    const dbModule = await import("../config/db");
    const pool = dbModule.getPool();
    const sql = dbModule.default;

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("enrolledCourse", sql.NVarChar(255), enrolledCourse ?? null)
      .query("UPDATE [dbo].[Students] SET enrolledCourse = @enrolledCourse WHERE id = @id");

    return res.status(200).json({ message: "Enrolled course updated successfully." });
  } catch (err: unknown) {
    console.error("❌ updateEnrolledCourseByAdmin error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};



