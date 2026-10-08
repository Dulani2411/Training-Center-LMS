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
  const result = await pool.request()
    .input("id", sql.Int, id)
    .input("title", sql.NVarChar(255), m.title ?? null)
    .input("description", sql.NVarChar(sql.MAX), m.description ?? null)
    .query(`
      UPDATE [dbo].[CourseMaterials]
      SET title = ISNULL(@title, title),
          description = ISNULL(@description, description)
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
