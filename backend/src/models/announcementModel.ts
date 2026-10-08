import sql, { getPool } from "../config/db";

export interface Announcement {
  id?: number;
  title: string;
  content: string;
  courseId?: number | null; // null = global announcement for all
  createdByUsername?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Ensure the table exists
export const ensureAnnouncementsTable = async () => {
  const pool = getPool();
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Announcements' AND xtype='U')
    CREATE TABLE [dbo].[Announcements] (
      id            INT IDENTITY(1,1) PRIMARY KEY,
      title         NVARCHAR(255) NOT NULL,
      content       NVARCHAR(MAX) NOT NULL,
      courseId      INT NULL,
      createdByUsername NVARCHAR(100) NOT NULL DEFAULT 'Superadmin',
      createdAt     DATETIME2 DEFAULT GETDATE(),
      updatedAt     DATETIME2 DEFAULT GETDATE()
    )
  `);
};

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  const pool = getPool();
  const result = await pool.request().query(
    "SELECT * FROM [dbo].[Announcements] ORDER BY createdAt DESC"
  );
  return result.recordset as Announcement[];
};

export const getAnnouncementsByCourse = async (courseId: number): Promise<Announcement[]> => {
  const pool = getPool();
  const result = await pool.request()
    .input("courseId", sql.Int, courseId)
    .query("SELECT * FROM [dbo].[Announcements] WHERE courseId = @courseId OR courseId IS NULL ORDER BY createdAt DESC");
  return result.recordset as Announcement[];
};

export const createAnnouncement = async (a: Announcement): Promise<Announcement> => {
  const pool = getPool();
  const result = await pool.request()
    .input("title", sql.NVarChar(255), a.title)
    .input("content", sql.NVarChar(sql.MAX), a.content)
    .input("courseId", sql.Int, a.courseId ?? null)
    .input("createdByUsername", sql.NVarChar(100), a.createdByUsername ?? "Superadmin")
    .query(`
      INSERT INTO [dbo].[Announcements] (title, content, courseId, createdByUsername)
      OUTPUT INSERTED.*
      VALUES (@title, @content, @courseId, @createdByUsername)
    `);
  return result.recordset[0] as Announcement;
};

export const updateAnnouncement = async (id: number, a: Partial<Announcement>): Promise<boolean> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .input("title", sql.NVarChar(255), a.title ?? null)
    .input("content", sql.NVarChar(sql.MAX), a.content ?? null)
    .input("courseId", sql.Int, a.courseId ?? null)
    .query(`
      UPDATE [dbo].[Announcements]
      SET title = ISNULL(@title, title),
          content = ISNULL(@content, content),
          courseId = @courseId,
          updatedAt = GETDATE()
      WHERE id = @id
    `);
  return (result.rowsAffected?.[0] ?? 0) > 0;
};

export const deleteAnnouncement = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM [dbo].[Announcements] WHERE id = @id");
  return (result.rowsAffected?.[0] ?? 0) > 0;
};
