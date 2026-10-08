-- Create Training Applications Table for Google Form submissions
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
    
    -- O/L Details
    [olYear] NVARCHAR(10) NOT NULL,
    [olResultsJSON] NVARCHAR(MAX) NOT NULL, 
    
    -- A/L Details
    [alYear] NVARCHAR(10) NOT NULL,
    [alStream] NVARCHAR(100) NOT NULL,
    [alResultsJSON] NVARCHAR(MAX) NOT NULL,
    
    -- Preferences and Work
    [trainingPreference] NVARCHAR(255) NOT NULL,
    [workExperienceJSON] NVARCHAR(MAX),
    
    -- Achievements
    [specialAchievements] NVARCHAR(MAX),
    [sportsAchievements] NVARCHAR(MAX),
    
    -- Referees
    [refereesJSON] NVARCHAR(MAX) NOT NULL,
    
    -- Uploaded File
    [cvDriveLink] NVARCHAR(MAX) NOT NULL,
    
    -- Audit
    [createdAt] DATETIME DEFAULT GETDATE(),
    [isReviewed] BIT DEFAULT 0 -- For Admin interface later
);
