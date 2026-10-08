-- =============================================
-- 008_CREATE_ENROLLMENT_REQUESTS_TABLE.sql
-- Student requests to enroll in a Course.
-- Admin / Sub-Admin reviews and approves/rejects.
-- Status: PENDING | APPROVED | REJECTED
-- =============================================

IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[EnrollmentRequests]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[EnrollmentRequests] (
        [id]         INT IDENTITY(1,1) PRIMARY KEY,
        [studentId]  INT          NOT NULL,
        [courseId]   INT          NOT NULL,
        [status]     NVARCHAR(20) NOT NULL DEFAULT 'PENDING'
                         CONSTRAINT CK_EnrollmentRequests_Status
                             CHECK ([status] IN ('PENDING', 'APPROVED', 'REJECTED')),
        [reviewedBy] INT          NULL,
        [reviewedAt] DATETIME     NULL,
        [createdAt]  DATETIME     NOT NULL DEFAULT GETDATE(),

        -- FK → Students
        CONSTRAINT FK_EnrollmentRequests_Student
            FOREIGN KEY ([studentId])
            REFERENCES [dbo].[Students]([id])
            ON DELETE CASCADE,

        -- FK → Courses
        CONSTRAINT FK_EnrollmentRequests_Course
            FOREIGN KEY ([courseId])
            REFERENCES [dbo].[Courses]([id])
            ON DELETE CASCADE,

        -- FK → Users (reviewer: Admin or Sub-Admin), NULL if not yet reviewed
        CONSTRAINT FK_EnrollmentRequests_Reviewer
            FOREIGN KEY ([reviewedBy])
            REFERENCES [dbo].[Users]([id])
            ON DELETE SET NULL,

        -- A student can only have one request per course
        CONSTRAINT UQ_EnrollmentRequests_Student_Course
            UNIQUE ([studentId], [courseId])
    );

    -- Index for fast status filtering
    CREATE INDEX IX_EnrollmentRequests_Status
        ON [dbo].[EnrollmentRequests]([status]);

    -- Index for fast lookup by courseId
    CREATE INDEX IX_EnrollmentRequests_CourseId
        ON [dbo].[EnrollmentRequests]([courseId]);

    PRINT '✅ EnrollmentRequests table created successfully.';
END
ELSE
BEGIN
    PRINT '⚠️ EnrollmentRequests table already exists. Skipping.';
END;
