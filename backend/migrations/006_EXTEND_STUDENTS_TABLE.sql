-- =============================================
-- 006_EXTEND_STUDENTS_TABLE.sql
-- Extends the existing Students table with
-- userId (FK → Users), phone, address columns
-- and links Students to the new Users table
-- =============================================

-- Step 1: Add [userId] column if it does not exist
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Students]')
      AND name = 'userId'
)
BEGIN
    ALTER TABLE [dbo].[Students]
        ADD [userId] INT NULL;

    PRINT '✅ Column [userId] added to Students.';
END
ELSE
BEGIN
    PRINT '⚠️ Column [userId] already exists. Skipping.';
END;

-- Step 2: Add [phone] column if it does not exist
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Students]')
      AND name = 'phone'
)
BEGIN
    ALTER TABLE [dbo].[Students]
        ADD [phone] NVARCHAR(30) NULL;

    PRINT '✅ Column [phone] added to Students.';
END
ELSE
BEGIN
    PRINT '⚠️ Column [phone] already exists. Skipping.';
END;

-- Step 3: Add [address] column if it does not exist
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Students]')
      AND name = 'address'
)
BEGIN
    ALTER TABLE [dbo].[Students]
        ADD [address] NVARCHAR(255) NULL;

    PRINT '✅ Column [address] added to Students.';
END
ELSE
BEGIN
    PRINT '⚠️ Column [address] already exists. Skipping.';
END;

-- Step 4: Add FK constraint (userId → Users.id) if not already present
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Students_Users'
      AND parent_object_id = OBJECT_ID(N'[dbo].[Students]')
)
BEGIN
    ALTER TABLE [dbo].[Students]
        ADD CONSTRAINT FK_Students_Users
            FOREIGN KEY ([userId])
            REFERENCES [dbo].[Users]([id])
            ON DELETE CASCADE;

    PRINT '✅ FK_Students_Users constraint added.';
END
ELSE
BEGIN
    PRINT '⚠️ FK_Students_Users already exists. Skipping.';
END;
