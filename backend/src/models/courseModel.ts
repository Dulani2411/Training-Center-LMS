import sql, { getPool } from "../config/db";

// =============================================
// Course Interface — aligned with new schema
// (teacherId removed; use CourseAssignments table)
// =============================================
export interface Course {
  id?: number;
  courseName: string;
  description?: string;
  duration?: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
}

// =============================================
// Get all courses
// =============================================
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM [dbo].[Courses] ORDER BY createdAt DESC");
    return result.recordset as Course[];
  } catch (err) {
    console.error("❌ getAllCourses error:", err);
    throw err;
  }
};

// =============================================
// Get a single course by ID
// =============================================
export const getCourseById = async (id: number): Promise<Course | null> => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM [dbo].[Courses] WHERE id = @id");
    return result.recordset.length > 0 ? (result.recordset[0] as Course) : null;
  } catch (err) {
    console.error("❌ getCourseById error:", err);
    throw err;
  }
};

// =============================================
// Create a new course
// =============================================
export const createCourse = async (course: Course): Promise<void> => {
  try {
    const pool = getPool();
    await pool
      .request()
      .input("courseName",  sql.NVarChar(200),    course.courseName)
      .input("description", sql.NVarChar(sql.MAX), course.description ?? null)
      .input("duration",    sql.NVarChar(100),     course.duration    ?? null)
      .input("status",      sql.NVarChar(10),      course.status      ?? "ACTIVE")
      .query(`
        INSERT INTO [dbo].[Courses] (courseName, description, duration, status)
        VALUES (@courseName, @description, @duration, @status)
      `);
  } catch (err) {
    console.error("❌ createCourse error:", err);
    throw err;
  }
};

// =============================================
// Update an existing course (fully parameterized)
// =============================================
export const updateCourse = async (id: number, course: Partial<Course>): Promise<void> => {
  try {
    const pool = getPool();
    const request = pool.request();
    request.input("id", sql.Int, id);

    const setClauses: string[] = [];

    if (course.courseName !== undefined) {
      request.input("courseName", sql.NVarChar(200), course.courseName);
      setClauses.push("courseName = @courseName");
    }
    if (course.description !== undefined) {
      request.input("description", sql.NVarChar(sql.MAX), course.description);
      setClauses.push("description = @description");
    }
    if (course.duration !== undefined) {
      request.input("duration", sql.NVarChar(100), course.duration);
      setClauses.push("duration = @duration");
    }
    if (course.status !== undefined) {
      request.input("status", sql.NVarChar(10), course.status);
      setClauses.push("status = @status");
    }

    if (setClauses.length === 0) return; // nothing to update

    await request.query(
      `UPDATE [dbo].[Courses] SET ${setClauses.join(", ")} WHERE id = @id`
    );
  } catch (err) {
    console.error("❌ updateCourse error:", err);
    throw err;
  }
};

// =============================================
// Delete a course
// =============================================
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM [dbo].[Courses] WHERE id = @id");
  } catch (err) {
    console.error("❌ deleteCourse error:", err);
    throw err;
  }
};
