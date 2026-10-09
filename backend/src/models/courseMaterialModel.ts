import sql, { getPool } from "../config/db";

export interface CourseMaterial {
  id?: number;
  courseId: number;
  title: string;
  description?: string;
  fileUrl?: string;
  linkUrl?: string;
  fileName?: string;
  fileType?: string; // 'pdf', 'word', 'ppt', 'other'
  uploadedBy?: string;
  createdAt?: Date;
}

export const ensureCourseMaterialsTable = async () => {
  const pool = getPool();
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CourseMaterials' AND xtype='U')
    CREATE TABLE [dbo].[CourseMaterials] (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      courseId    INT NOT NULL,
      title       NVARCHAR(255) NOT NULL,
      description NVARCHAR(MAX) NULL,
      fileUrl     NVARCHAR(500) NULL,
      linkUrl     NVARCHAR(1000) NULL,
      fileName    NVARCHAR(255) NULL,
      fileType    NVARCHAR(50)  NULL,
      uploadedBy  NVARCHAR(100) NOT NULL DEFAULT 'Superadmin',
      createdAt   DATETIME2 DEFAULT GETDATE()
    )
    IF COL_LENGTH('dbo.CourseMaterials', 'linkUrl') IS NULL
      ALTER TABLE [dbo].[CourseMaterials] ADD linkUrl NVARCHAR(1000) NULL
  `);
};

export const getMaterialsByCourse = async (courseId: number): Promise<CourseMaterial[]> => {
  const pool = getPool();
  const result = await pool.request()
    .input("courseId", sql.Int, courseId)
    .query("SELECT * FROM [dbo].[CourseMaterials] WHERE courseId = @courseId ORDER BY createdAt DESC");
  return result.recordset as CourseMaterial[];
};

export const getMaterialById = async (id: number): Promise<CourseMaterial | null> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM [dbo].[CourseMaterials] WHERE id = @id");
  return result.recordset[0] ? result.recordset[0] as CourseMaterial : null;
};

export const getAllMaterials = async (): Promise<CourseMaterial[]> => {
  const pool = getPool();
  const result = await pool.request()
    .query("SELECT * FROM [dbo].[CourseMaterials] ORDER BY createdAt DESC");
  return result.recordset as CourseMaterial[];
};

export const createMaterial = async (m: CourseMaterial): Promise<CourseMaterial> => {
  const pool = getPool();
  const result = await pool.request()
    .input("courseId", sql.Int, m.courseId)
    .input("title", sql.NVarChar(255), m.title)
    .input("description", sql.NVarChar(sql.MAX), m.description ?? null)
    .input("fileUrl", sql.NVarChar(500), m.fileUrl ?? null)
    .input("linkUrl", sql.NVarChar(1000), m.linkUrl ?? null)
    .input("fileName", sql.NVarChar(255), m.fileName ?? null)
    .input("fileType", sql.NVarChar(50), m.fileType ?? null)
    .input("uploadedBy", sql.NVarChar(100), m.uploadedBy ?? "Superadmin")
    .query(`
      INSERT INTO [dbo].[CourseMaterials] (courseId, title, description, fileUrl, linkUrl, fileName, fileType, uploadedBy)
      OUTPUT INSERTED.*
      VALUES (@courseId, @title, @description, @fileUrl, @linkUrl, @fileName, @fileType, @uploadedBy)
    `);
  return result.recordset[0] as CourseMaterial;
};

export const updateMaterial = async (id: number, m: Partial<CourseMaterial>): Promise<boolean> => {
  const pool = getPool();
  const request = pool.request().input("id", sql.Int, id);
  const setClauses: string[] = [];
  if (m.title !== undefined) {
    request.input("title", sql.NVarChar(255), m.title);
    setClauses.push("title = @title");
  }
  if (m.description !== undefined) {
    request.input("description", sql.NVarChar(sql.MAX), m.description);
    setClauses.push("description = @description");
  }
  if (m.linkUrl !== undefined) {
    request.input("linkUrl", sql.NVarChar(1000), m.linkUrl || null);
    setClauses.push("linkUrl = @linkUrl");
  }
  if (m.fileUrl !== undefined) {
    request.input("fileUrl", sql.NVarChar(500), m.fileUrl || null);
    request.input("fileName", sql.NVarChar(255), m.fileName || null);
    request.input("fileType", sql.NVarChar(50), m.fileType || null);
    setClauses.push("fileUrl = @fileUrl", "fileName = @fileName", "fileType = @fileType");
  }
  if (setClauses.length === 0) return false;
  const result = await request.query(`
    UPDATE [dbo].[CourseMaterials]
    SET ${setClauses.join(", ")}
    WHERE id = @id
  `);
  return (result.rowsAffected?.[0] ?? 0) > 0;
};

export const deleteMaterial = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM [dbo].[CourseMaterials] WHERE id = @id");
  return (result.rowsAffected?.[0] ?? 0) > 0;
};
