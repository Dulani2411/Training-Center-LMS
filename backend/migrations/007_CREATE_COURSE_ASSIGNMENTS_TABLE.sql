-- =============================================
-- 007_CREATE_COURSE_ASSIGNMENTS_TABLE.sql
-- Links Admin / Sub-Admin users to Courses
-- they are responsible for managing
-- =============================================

IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[CourseAssignments]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[CourseAssignments] (
        [id]         INT IDENTITY(1,1) PRIMARY KEY,
        [courseId]   INT      NOT NULL,
        [adminId]    INT      NOT NULL,
        [assignedAt] DATETIME NOT NULL DEFAULT GETDATE(),

        -- FK → Courses
        CONSTRAINT FK_CourseAssignments_Course
            FOREIGN KEY ([courseId])
            REFERENCES [dbo].[Courses]([id])
            ON DELETE CASCADE,

        -- FK → Users (Admin or Sub-Admin)
        CONSTRAINT FK_CourseAssignments_Admin
            FOREIGN KEY ([adminId])
            REFERENCES [dbo].[Users]([id])
            ON DELETE CASCADE,

        -- One admin cannot be assigned to the same course twice
        CONSTRAINT UQ_CourseAssignments_Course_Admin
            UNIQUE ([courseId], [adminId])
    );

    -- Index for fast lookup by adminId
    CREATE INDEX IX_CourseAssignments_AdminId
        ON [dbo].[CourseAssignments]([adminId]);

    PRINT '✅ CourseAssignments table created successfully.';
END
ELSE
BEGIN
    PRINT '⚠️ CourseAssignments table already exists. Skipping.';
END;
