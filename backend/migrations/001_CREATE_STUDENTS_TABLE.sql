-- Create Students Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Students]
    (
        [id] INT PRIMARY KEY IDENTITY(1,1),
        [email] NVARCHAR(255) NOT NULL UNIQUE,
        [password] NVARCHAR(255) NOT NULL,
        [name] NVARCHAR(255),
        [studentId] NVARCHAR(255),
        [isPasswordChanged] BIT DEFAULT 0,
        [createdAt] DATETIME DEFAULT GETUTCDATE()
    );
    
    -- Create index on email for faster lookups
    CREATE INDEX IX_Students_Email ON [dbo].[Students]([email]);
END;
