import sql, { getPool } from "../config/db";
import bcrypt from "bcryptjs";

// =============================================
// Student Interface
// password is optional — stripped from responses
// =============================================
export interface Student {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  studentId?: string;
  enrolledCourse?: string;
  isPasswordChanged?: boolean;
  photoUrl?: string;
  createdAt?: Date;
}

// Input type when creating — password is required
export interface StudentInput extends Omit<Student, "password"> {
  password: string;
}

// =============================================
// Get student by email (case-insensitive)
// =============================================
export const getStudentByEmail = async (email: string): Promise<Student | null> => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(255), email.trim().toLowerCase())
      .query(`
        SELECT * FROM [dbo].[Students]
        WHERE LOWER(LTRIM(RTRIM(email))) = @email
      `);
    return result.recordset.length > 0 ? (result.recordset[0] as Student) : null;
  } catch (err) {
    console.error("❌ getStudentByEmail error:", err);
    throw err;
  }
};

// =============================================
// Get student by identifier (studentId or email)
// =============================================
export const getStudentByIdentifier = async (identifier: string): Promise<Student | null> => {
  try {
    const pool = getPool();
    const clean = identifier.trim().toLowerCase();
    const result = await pool
      .request()
      .input("identifier", sql.NVarChar(255), clean)
      .query(`
        SELECT * FROM [dbo].[Students]
        WHERE LOWER(LTRIM(RTRIM(email))) = @identifier
           OR LOWER(LTRIM(RTRIM(studentId))) = @identifier
      `);
    return result.recordset.length > 0 ? (result.recordset[0] as Student) : null;
  } catch (err) {
    console.error("❌ getStudentByIdentifier error:", err);
    throw err;
  }
};

// =============================================
// Get student by ID
// =============================================
export const getStudentById = async (id: number): Promise<Student | null> => {
  try {
    const pool = getPool();
    await pool.request().query(`
      IF COL_LENGTH('dbo.Students', 'photoUrl') IS NULL
        ALTER TABLE [dbo].[Students] ADD photoUrl NVARCHAR(500) NULL
    `);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM [dbo].[Students] WHERE id = @id");
    return result.recordset.length > 0 ? (result.recordset[0] as Student) : null;
  } catch (err) {
    console.error("❌ getStudentById error:", err);
    throw err;
  }
};

export const updateStudentPhoto = async (id: number, photoUrl: string): Promise<boolean> => {
  const pool = getPool();
  await pool.request().query(`
    IF COL_LENGTH('dbo.Students', 'photoUrl') IS NULL
      ALTER TABLE [dbo].[Students] ADD photoUrl NVARCHAR(500) NULL
  `);
  const result = await pool.request()
    .input("id", sql.Int, id)
    .input("photoUrl", sql.NVarChar(500), photoUrl)
    .query("UPDATE [dbo].[Students] SET photoUrl = @photoUrl WHERE id = @id");
  return (result.rowsAffected?.[0] ?? 0) > 0;
};

// =============================================
// Create a new student (admin adds student first)
// =============================================
export const createStudent = async (student: StudentInput): Promise<Student> => {
  try {
    const pool = getPool();
    const hashedPassword = await bcrypt.hash(student.password, 12);

    const result = await pool
      .request()
      .input("email",    sql.NVarChar(255), student.email)
      .input("password", sql.NVarChar(255), hashedPassword)
      .input("name",     sql.NVarChar(255), student.name      ?? null)
      .input("studentId",sql.NVarChar(255), student.studentId ?? null)
      .input("enrolledCourse", sql.NVarChar(255), student.enrolledCourse ?? null)
      .query(`
        INSERT INTO [dbo].[Students] (email, password, name, studentId, enrolledCourse)
        OUTPUT INSERTED.*
        VALUES (@email, @password, @name, @studentId, @enrolledCourse)
      `);

    const created = result.recordset[0] as Student;
    delete created.password; // never return the hash
    return created;
  } catch (err) {
    console.error("❌ createStudent error:", err);
    throw err;
  }
};

// =============================================
// Verify plain password against stored hash
// =============================================
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// =============================================
// Update password by email (used during first-time setup)
// =============================================
export const updateStudentPasswordByEmail = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const pool = getPool();
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const result = await pool
      .request()
      .input("email",    sql.NVarChar(255), email.trim().toLowerCase())
      .input("password", sql.NVarChar(255), hashedPassword)
      .query(`
        UPDATE [dbo].[Students]
        SET password = @password, isPasswordChanged = 1
        WHERE LOWER(LTRIM(RTRIM(email))) = @email
      `);

    const rowsAffected = result.rowsAffected?.[0] ?? 0;
    if (rowsAffected === 0) {
      console.warn(`⚠️ No student found for email: ${email}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ updateStudentPasswordByEmail error:", err);
    throw err;
  }
};

// =============================================
// Change password on first login (by student ID)
// =============================================
export const changePasswordOnFirstLogin = async (
  id: number,
  newPassword: string
): Promise<boolean> => {
  try {
    const pool = getPool();
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const result = await pool
      .request()
      .input("id",       sql.Int,           id)
      .input("password", sql.NVarChar(255), hashedPassword)
      .query(`
        UPDATE [dbo].[Students]
        SET password = @password, isPasswordChanged = 1
        WHERE id = @id
      `);

    const rowsAffected = result.rowsAffected?.[0] ?? 0;
    if (rowsAffected === 0) {
      console.warn(`⚠️ No student found for ID: ${id}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ changePasswordOnFirstLogin error:", err);
    throw err;
  }
};
