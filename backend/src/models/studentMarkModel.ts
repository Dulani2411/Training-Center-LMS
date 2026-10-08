import sql, { getPool } from "../config/db";

export interface StudentMark {
  id?: number;
  studentId: number;  // references Students.id
  courseId: number;
  subject?: string;
  mark?: number;
  grade?: string;
  remarks?: string;
  addedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ensureStudentMarksTable = async () => {
  const pool = getPool();
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='StudentMarks' AND xtype='U')
    CREATE TABLE [dbo].[StudentMarks] (
      id         INT IDENTITY(1,1) PRIMARY KEY,
      studentId  INT NOT NULL,
      courseId   INT NOT NULL,
      subject    NVARCHAR(255) NULL,
      mark       FLOAT NULL,
      grade      NVARCHAR(10) NULL,
      remarks    NVARCHAR(MAX) NULL,
      addedBy    NVARCHAR(100) NOT NULL DEFAULT 'Superadmin',
      createdAt  DATETIME2 DEFAULT GETDATE(),
      updatedAt  DATETIME2 DEFAULT GETDATE()
    )
  `);
};

export const getMarksByStudent = async (studentId: number): Promise<StudentMark[]> => {
  const pool = getPool();
  const result = await pool.request()
    .input("studentId", sql.Int, studentId)
    .query(`
      SELECT sm.*, c.courseName
      FROM [dbo].[StudentMarks] sm
      LEFT JOIN [dbo].[Courses] c ON c.id = sm.courseId
      WHERE sm.studentId = @studentId
      ORDER BY sm.createdAt DESC
    `);
  return result.recordset as StudentMark[];
};

export const getMarksByCourse = async (courseId: number): Promise<StudentMark[]> => {
  const pool = getPool();
  const result = await pool.request()
    .input("courseId", sql.Int, courseId)
    .query(`
      SELECT sm.*, s.name as studentName, s.studentId as studentRegId
      FROM [dbo].[StudentMarks] sm
      LEFT JOIN [dbo].[Students] s ON s.id = sm.studentId
      WHERE sm.courseId = @courseId
      ORDER BY sm.createdAt DESC
    `);
  return result.recordset as StudentMark[];
};

export const getAllMarks = async (): Promise<StudentMark[]> => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT sm.*, s.name as studentName, s.studentId as studentRegId, c.courseName
    FROM [dbo].[StudentMarks] sm
    LEFT JOIN [dbo].[Students] s ON s.id = sm.studentId
    LEFT JOIN [dbo].[Courses] c ON c.id = sm.courseId
    ORDER BY sm.createdAt DESC
  `);
  return result.recordset as StudentMark[];
};

export const createMark = async (m: StudentMark): Promise<StudentMark> => {
  const pool = getPool();
  const result = await pool.request()
    .input("studentId", sql.Int, m.studentId)
    .input("courseId", sql.Int, m.courseId)
    .input("subject", sql.NVarChar(255), m.subject ?? null)
    .input("mark", sql.Float, m.mark ?? null)
    .input("grade", sql.NVarChar(10), m.grade ?? null)
    .input("remarks", sql.NVarChar(sql.MAX), m.remarks ?? null)
    .input("addedBy", sql.NVarChar(100), m.addedBy ?? "Superadmin")
    .query(`
      INSERT INTO [dbo].[StudentMarks] (studentId, courseId, subject, mark, grade, remarks, addedBy)
      OUTPUT INSERTED.*
      VALUES (@studentId, @courseId, @subject, @mark, @grade, @remarks, @addedBy)
    `);
  return result.recordset[0] as StudentMark;
};

export const updateMark = async (id: number, m: Partial<StudentMark>): Promise<boolean> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .input("mark", sql.Float, m.mark ?? null)
    .input("grade", sql.NVarChar(10), m.grade ?? null)
    .input("remarks", sql.NVarChar(sql.MAX), m.remarks ?? null)
    .query(`
      UPDATE [dbo].[StudentMarks]
      SET mark = COALESCE(@mark, mark),
          grade = COALESCE(@grade, grade),
          remarks = COALESCE(@remarks, remarks),
          updatedAt = GETDATE()
      WHERE id = @id
    `);
  return (result.rowsAffected?.[0] ?? 0) > 0;
};

export const deleteMark = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM [dbo].[StudentMarks] WHERE id = @id");
  return (result.rowsAffected?.[0] ?? 0) > 0;
};
