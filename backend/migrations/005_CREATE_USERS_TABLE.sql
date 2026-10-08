-- =============================================
-- 005_CREATE_USERS_TABLE.sql
-- Creates the Users table for Auth & Role Management
-- Roles: ADMIN | SUB_ADMIN | STUDENT
-- =============================================

IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[Users] (
        [id]        INT IDENTITY(1,1) PRIMARY KEY,
        [name]      NVARCHAR(150)   NOT NULL,
        [email]     NVARCHAR(150)   NOT NULL,
        [password]  NVARCHAR(255)   NOT NULL,
        [role]      NVARCHAR(20)    NOT NULL DEFAULT 'STUDENT'
                        CONSTRAINT CK_Users_Role CHECK ([role] IN ('ADMIN', 'SUB_ADMIN', 'STUDENT')),
        [isActive]  BIT             NOT NULL DEFAULT 1,
        [createdAt] DATETIME        NOT NULL DEFAULT GETDATE()
    );

    -- Unique index on email
    CREATE UNIQUE INDEX UX_Users_Email ON [dbo].[Users]([email]);

    PRINT '✅ Users table created successfully.';
END
ELSE
BEGIN
    PRINT '⚠️ Users table already exists. Skipping.';
END;
