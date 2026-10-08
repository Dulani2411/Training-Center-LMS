-- ==========================================================
-- FULL DATABASE SETUP - Training Center LMS
-- MySQL / MariaDB version  (XAMPP compatible)
-- ==========================================================
-- Steps:
--   1. Create & select database
--   2. Users
--   3. Students
--   4. Courses
--   5. TrainingApplications
--   6. CourseAssignments
--   7. EnrollmentRequests
--   8. StudentCourses
--   9. Seed Data
-- ==========================================================

-- ==========================================================
-- STEP 1: Create Database
-- ==========================================================
CREATE DATABASE IF NOT EXISTS training_center_lms
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE training_center_lms;


-- ==========================================================
-- STEP 2: Users Table
-- Roles: ADMIN | SUB_ADMIN | STUDENT
-- ==========================================================
CREATE TABLE IF NOT EXISTS `Users` (
    `id`        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`      VARCHAR(150) NOT NULL,
    `email`     VARCHAR(150) NOT NULL,
    `password`  VARCHAR(255) NOT NULL,
    `role`      ENUM('ADMIN','SUB_ADMIN','STUDENT') NOT NULL DEFAULT 'STUDENT',
    `isActive`  TINYINT(1)   NOT NULL DEFAULT 1,
    `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `UX_Users_Email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 3: Students Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS `Students` (
    `id`                INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email`             VARCHAR(255) NOT NULL,
    `password`          VARCHAR(255) NOT NULL,
    `name`              VARCHAR(255) NULL,
    `studentId`         VARCHAR(255) NULL,
    `isPasswordChanged` TINYINT(1)   DEFAULT 0,
    `createdAt`         DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `userId`            INT          NULL,
    `phone`             VARCHAR(30)  NULL,
    `address`           VARCHAR(255) NULL,

    UNIQUE KEY `UX_Students_Email` (`email`),
    INDEX `IX_Students_Email` (`email`),

    CONSTRAINT `FK_Students_Users`
        FOREIGN KEY (`userId`)
        REFERENCES `Users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 4: Courses Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS `Courses` (
    `id`          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseName`  VARCHAR(255) NOT NULL,
    `description` TEXT         NULL,
    `duration`    VARCHAR(100) NULL,
    `status`      ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `teacherId`   INT          NULL,

    INDEX `IX_Courses_TeacherId` (`teacherId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 5: Training Applications Table
-- Stores public application form submissions
-- ==========================================================
CREATE TABLE IF NOT EXISTS `TrainingApplications` (
    `id`                 INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `fullName`           VARCHAR(500) NOT NULL,
    `nameWithInitials`   VARCHAR(255) NOT NULL,
    `address`            TEXT         NOT NULL,
    `district`           VARCHAR(100) NOT NULL,
    `mobile`             VARCHAR(50)  NOT NULL,
    `landline`           VARCHAR(50)  NULL,
    `dob`                DATE         NOT NULL,
    `gender`             VARCHAR(20)  NOT NULL,
    `civilStatus`        VARCHAR(50)  NOT NULL,
    `nic`                VARCHAR(50)  NOT NULL,

    -- O/L Details
    `olYear`             VARCHAR(10)  NOT NULL,
    `olResultsJSON`      JSON         NOT NULL,

    -- A/L Details
    `alYear`             VARCHAR(10)  NOT NULL,
    `alStream`           VARCHAR(100) NOT NULL,
    `alResultsJSON`      JSON         NOT NULL,

    -- Preferences and Work Experience
    `trainingPreference` VARCHAR(255) NOT NULL,
    `workExperienceJSON` JSON         NULL,

    -- Achievements
    `specialAchievements` TEXT        NULL,
    `sportsAchievements`  TEXT        NULL,

    -- Referees
    `refereesJSON`       JSON         NOT NULL,

    -- Uploaded CV
    `cvDriveLink`        TEXT         NOT NULL,

    -- Audit
    `createdAt`          DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `isReviewed`         TINYINT(1)   DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 6: Course Assignments Table
-- Links Admin / Sub-Admin to Courses they manage
-- ==========================================================
CREATE TABLE IF NOT EXISTS `CourseAssignments` (
    `id`         INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseId`   INT      NOT NULL,
    `adminId`    INT      NOT NULL,
    `assignedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `UQ_CourseAssignments_Course_Admin` (`courseId`, `adminId`),
    INDEX `IX_CourseAssignments_AdminId` (`adminId`),

    CONSTRAINT `FK_CourseAssignments_Course`
        FOREIGN KEY (`courseId`)
        REFERENCES `Courses`(`id`)
        ON DELETE CASCADE,

    CONSTRAINT `FK_CourseAssignments_Admin`
        FOREIGN KEY (`adminId`)
        REFERENCES `Users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 7: Enrollment Requests Table
-- Student requests to enroll in a Course
-- Status: PENDING | APPROVED | REJECTED
-- ==========================================================
CREATE TABLE IF NOT EXISTS `EnrollmentRequests` (
    `id`         INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `studentId`  INT      NOT NULL,
    `courseId`   INT      NOT NULL,
    `status`     ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewedBy` INT      NULL,
    `reviewedAt` DATETIME NULL,
    `createdAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `UQ_EnrollmentRequests_Student_Course` (`studentId`, `courseId`),
    INDEX `IX_EnrollmentRequests_Status` (`status`),
    INDEX `IX_EnrollmentRequests_CourseId` (`courseId`),

    CONSTRAINT `FK_EnrollmentRequests_Student`
        FOREIGN KEY (`studentId`)
        REFERENCES `Students`(`id`)
        ON DELETE CASCADE,

    CONSTRAINT `FK_EnrollmentRequests_Course`
        FOREIGN KEY (`courseId`)
        REFERENCES `Courses`(`id`)
        ON DELETE CASCADE,

    CONSTRAINT `FK_EnrollmentRequests_Reviewer`
        FOREIGN KEY (`reviewedBy`)
        REFERENCES `Users`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 8: Student Courses Table
-- Confirmed / approved enrollments
-- ==========================================================
CREATE TABLE IF NOT EXISTS `StudentCourses` (
    `id`         INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `studentId`  INT      NOT NULL,
    `courseId`   INT      NOT NULL,
    `enrolledAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `UQ_StudentCourses_Student_Course` (`studentId`, `courseId`),
    INDEX `IX_StudentCourses_CourseId` (`courseId`),

    CONSTRAINT `FK_StudentCourses_Student`
        FOREIGN KEY (`studentId`)
        REFERENCES `Students`(`id`)
        ON DELETE CASCADE,

    CONSTRAINT `FK_StudentCourses_Course`
        FOREIGN KEY (`courseId`)
        REFERENCES `Courses`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- STEP 9: Seed Data
-- ==========================================================
-- ⚠️  IMPORTANT:
-- Admin & SubAdmin password hashes are placeholders.
-- Generate real hashes from your backend:
--   node -e "require('bcrypt').hash('Admin@1234',10,(e,h)=>console.log(h))"
-- Then replace the placeholder values below.
--
-- Student default password: Password123!
-- Hash: $2b$10$jrYubLXtRau/vSi2bckS3etnTy0hWIm9xtuyVMDpnKbNg5slEhdca
-- ==========================================================

-- -----------------------------------------------
-- Seed: Admin Users
-- -----------------------------------------------
INSERT INTO `Users` (`name`, `email`, `password`, `role`, `isActive`)
SELECT 'Main Admin', 'admin@trainingcenter.com',
       '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_ADMIN',
       'ADMIN', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `Users` WHERE `email` = 'admin@trainingcenter.com'
);

INSERT INTO `Users` (`name`, `email`, `password`, `role`, `isActive`)
SELECT 'Sub Admin', 'subadmin@trainingcenter.com',
       '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_SUBADMIN',
       'SUB_ADMIN', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `Users` WHERE `email` = 'subadmin@trainingcenter.com'
);

-- -----------------------------------------------
-- Seed: Sample Students (password = Password123!)
-- -----------------------------------------------
INSERT INTO `Students` (`email`, `password`, `name`, `studentId`, `isPasswordChanged`)
SELECT 'student1@example.com',
       '$2b$10$jrYubLXtRau/vSi2bckS3etnTy0hWIm9xtuyVMDpnKbNg5slEhdca',
       'John Doe', 'STU001', 0
WHERE NOT EXISTS (
    SELECT 1 FROM `Students` WHERE `email` = 'student1@example.com'
);

INSERT INTO `Students` (`email`, `password`, `name`, `studentId`, `isPasswordChanged`)
SELECT 'student2@example.com',
       '$2b$10$jrYubLXtRau/vSi2bckS3etnTy0hWIm9xtuyVMDpnKbNg5slEhdca',
       'Jane Smith', 'STU002', 0
WHERE NOT EXISTS (
    SELECT 1 FROM `Students` WHERE `email` = 'student2@example.com'
);

INSERT INTO `Students` (`email`, `password`, `name`, `studentId`, `isPasswordChanged`)
SELECT 'student3@example.com',
       '$2b$10$jrYubLXtRau/vSi2bckS3etnTy0hWIm9xtuyVMDpnKbNg5slEhdca',
       'Bob Johnson', 'STU003', 0
WHERE NOT EXISTS (
    SELECT 1 FROM `Students` WHERE `email` = 'student3@example.com'
);

-- -----------------------------------------------
-- Seed: Courses
-- -----------------------------------------------
INSERT INTO `Courses` (`courseName`, `description`, `duration`, `status`)
SELECT 'Introduction to Programming',
       'Basic programming concepts and problem solving.',
       '3 Months', 'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM `Courses` WHERE `courseName` = 'Introduction to Programming'
);

INSERT INTO `Courses` (`courseName`, `description`, `duration`, `status`)
SELECT 'Advanced Web Development',
       'Advanced frontend and backend web development.',
       '6 Months', 'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM `Courses` WHERE `courseName` = 'Advanced Web Development'
);

INSERT INTO `Courses` (`courseName`, `description`, `duration`, `status`)
SELECT 'Database Design',
       'Database design, SQL and database management.',
       '3 Months', 'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM `Courses` WHERE `courseName` = 'Database Design'
);


-- ==========================================================
-- SETUP COMPLETE
-- ==========================================================
SELECT 'Database setup completed!' AS Status;
SELECT 'Tables created: Users, Students, Courses, TrainingApplications, CourseAssignments, EnrollmentRequests, StudentCourses' AS Info;
SELECT 'Remember to replace bcrypt hash placeholders for Admin and SubAdmin users.' AS Warning;
