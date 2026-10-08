import { getPool, connectDB } from "./src/config/db";

async function run() {
  try {
    await connectDB();
    const pool = getPool();

    console.log("Checking and altering Courses table...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Courses') AND name = 'duration')
        ALTER TABLE dbo.Courses ADD duration NVARCHAR(100) NULL;

      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Courses') AND name = 'status')
        ALTER TABLE dbo.Courses ADD status NVARCHAR(20) DEFAULT 'ACTIVE' NULL;

      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Courses') AND name = 'createdAt')
        ALTER TABLE dbo.Courses ADD createdAt DATETIME DEFAULT GETDATE() NULL;

      ALTER TABLE dbo.Courses ALTER COLUMN teacherId INT NULL;
    `);
    console.log("✅ Courses columns verified.");

    console.log("Checking TrainingApplications table...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TrainingApplications]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[TrainingApplications] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [fullName] NVARCHAR(500) NOT NULL,
          [nameWithInitials] NVARCHAR(255) NOT NULL,
          [address] NVARCHAR(MAX) NOT NULL,
          [district] NVARCHAR(100) NOT NULL,
          [mobile] NVARCHAR(50) NOT NULL,
          [landline] NVARCHAR(50),
          [dob] DATE NOT NULL,
          [gender] NVARCHAR(20) NOT NULL,
          [civilStatus] NVARCHAR(50) NOT NULL,
          [nic] NVARCHAR(50) NOT NULL,
          [olYear] NVARCHAR(10) NOT NULL,
          [olResultsJSON] NVARCHAR(MAX) NOT NULL, 
          [alYear] NVARCHAR(10) NOT NULL,
          [alStream] NVARCHAR(100) NOT NULL,
          [alResultsJSON] NVARCHAR(MAX) NOT NULL,
          [trainingPreference] NVARCHAR(255) NOT NULL,
          [workExperienceJSON] NVARCHAR(MAX),
          [specialAchievements] NVARCHAR(MAX),
          [sportsAchievements] NVARCHAR(MAX),
          [refereesJSON] NVARCHAR(MAX) NOT NULL,
          [cvDriveLink] NVARCHAR(MAX) NOT NULL,
          [createdAt] DATETIME DEFAULT GETDATE(),
          [isReviewed] BIT DEFAULT 0
        );
        PRINT 'Created TrainingApplications';
      END
    `);
    console.log("✅ TrainingApplications verified.");

    const countRes = await pool.request().query("SELECT COUNT(*) as cnt FROM dbo.Courses");
    if (countRes.recordset[0].cnt === 0) {
      await pool.request().query(`
        INSERT INTO dbo.Courses (courseName, description, duration, status, createdAt)
        VALUES 
        ('Refinery Operation Technician', 'Comprehensive training program covering distillation, cracking, reforming, and petroleum processing units.', '1 Year', 'ACTIVE', GETDATE()),
        ('Mechanical Maintenance Apprentice', 'Hands-on apprentice program covering pumps, valves, rotating equipment, and plant fabrication.', '1 Year', 'ACTIVE', GETDATE()),
        ('Electrical & Instrumentation Trainee', 'Industrial control systems, DCS, field sensors, analyzers, and electrical distribution systems.', '6 Months', 'ACTIVE', GETDATE()),
        ('Health, Safety & Environment (HSE) in Oil & Gas', 'Petroleum industry safety standards, fire safety, gas testing, and hazard management.', '6 Months', 'ACTIVE', GETDATE());
      `);
      console.log("✅ Default courses seeded.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

run();
