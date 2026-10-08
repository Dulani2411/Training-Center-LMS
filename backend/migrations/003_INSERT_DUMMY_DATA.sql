-- Insert Dummy Students Data
-- Default password for these seeded accounts: Password123!
-- (bcrypt hash generated via backend/generateHash.js)
DECLARE @DefaultPasswordHash NVARCHAR(255) = '$2b$10$jrYubLXtRau/vSi2bckS3etnTy0hWIm9xtuyVMDpnKbNg5slEhdca';

IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE email = 'student1@example.com')
BEGIN
    INSERT INTO [dbo].[Students] (email, password, name, studentId, isPasswordChanged)
    VALUES ('student1@example.com', @DefaultPasswordHash, 'John Doe', 'STU001', 0);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE email = 'student2@example.com')
BEGIN
    INSERT INTO [dbo].[Students] (email, password, name, studentId, isPasswordChanged)
    VALUES ('student2@example.com', @DefaultPasswordHash, 'Jane Smith', 'STU002', 0);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE email = 'student3@example.com')
BEGIN
    INSERT INTO [dbo].[Students] (email, password, name, studentId, isPasswordChanged)
    VALUES ('student3@example.com', @DefaultPasswordHash, 'Bob Johnson', 'STU003', 0);
END;



-- Insert Dummy Courses Data
IF NOT EXISTS (SELECT 1 FROM [dbo].[Courses] WHERE courseName = 'Introduction to Programming')
BEGIN
    INSERT INTO [dbo].[Courses] (courseName, description, teacherId)
    VALUES ('Introduction to Programming', 'Learn the basics of programming', 1);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Courses] WHERE courseName = 'Advanced Web Development')
BEGIN
    INSERT INTO [dbo].[Courses] (courseName, description, teacherId)
    VALUES ('Advanced Web Development', 'Master modern web technologies', 1);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Courses] WHERE courseName = 'Database Design')
BEGIN
    INSERT INTO [dbo].[Courses] (courseName, description, teacherId)
    VALUES ('Database Design', 'Learn database design and optimization', 2);
END;
