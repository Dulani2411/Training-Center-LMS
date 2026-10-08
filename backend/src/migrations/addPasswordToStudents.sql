-- ✅ Migration: Add password column to Students table
-- This script adds a password column to the Students table if it doesn't exist

-- Check if password column exists, if not, add it
IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Students' 
    AND COLUMN_NAME = 'password'
)
BEGIN
    ALTER TABLE Students
    ADD password NVARCHAR(255) NOT NULL DEFAULT '';
    
    PRINT 'Password column added to Students table successfully ✅';
END
ELSE
BEGIN
    PRINT 'Password column already exists in Students table';
END

-- Optional: If you want to add email column as well (if it doesn't exist)
IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Students' 
    AND COLUMN_NAME = 'email'
)
BEGIN
    ALTER TABLE Students
    ADD email NVARCHAR(255) NOT NULL DEFAULT '';
    
    -- Add unique constraint on email
    CREATE UNIQUE INDEX IX_Students_Email ON Students(email);
    
    PRINT 'Email column added to Students table successfully ✅';
END
ELSE
BEGIN
    PRINT 'Email column already exists in Students table';
END

