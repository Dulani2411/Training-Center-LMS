-- =============================================
-- 009_CREATE_STUDENT_COURSES_TABLE.sql
-- Stores confirmed/approved Course enrollments.
-- Records are inserted here after an EnrollmentRequest
-- is approved by Admin / Sub-Admin.
-- =============================================

IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[StudentCourses]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[StudentCourses] (
        [id]         INT IDENTITY(1,1) PRIMARY KEY,
        [studentId]  INT      NOT NULL,
        [courseId]   INT      NOT NULL,
        [enrolledAt] DATETIME NOT NULL DEFAULT GETDATE(),

        -- FK → Students
        CONSTRAINT FK_StudentCourses_Student
            FOREIGN KEY ([studentId])
            REFERENCES [dbo].[Students]([id])
            ON DELETE CASCADE,

        -- FK → Courses
        CONSTRAINT FK_StudentCourses_Course
            FOREIGN KEY ([courseId])
            REFERENCES [dbo].[Courses]([id])
            ON DELETE CASCADE,

        -- A student can only be enrolled once per course
        CONSTRAINT UQ_StudentCourses_Student_Course
            UNIQUE ([studentId], [courseId])
    );

    -- Index for fast lookup by courseId
    CREATE INDEX IX_StudentCourses_CourseId
        ON [dbo].[StudentCourses]([courseId]);

    PRINT '✅ StudentCourses table created successfully.';
END
ELSE
BEGIN
    PRINT '⚠️ StudentCourses table already exists. Skipping.';
END;
