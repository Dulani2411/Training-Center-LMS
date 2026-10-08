-- Create Courses Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Courses]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Courses]
    (
        [id] INT PRIMARY KEY IDENTITY(1,1),
        [courseName] NVARCHAR(255) NOT NULL,
        [description] NVARCHAR(MAX),
        [teacherId] INT NOT NULL
    );
    
    -- Create index on teacherId for faster lookups
    CREATE INDEX IX_Courses_TeacherId ON [dbo].[Courses]([teacherId]);
END;
