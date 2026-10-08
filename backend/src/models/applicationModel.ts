import sql, { getPool } from "../config/db";

// =============================================
// Application Interface
// =============================================
export interface Application {
  id?: number;
  fullName: string;
  nameWithInitials: string;
  address: string;
  district: string;
  mobile: string;
  landline?: string;
  dob: string;
  gender: string;
  civilStatus: string;
  nic: string;
  traineeNumber?: string;
  personalEmail?: string;
  olYear: string;
  olResultsJSON: string;
  alYear: string;
  alStream: string;
  alResultsJSON: string;
  trainingPreference: string;
  workExperienceJSON?: string;
  specialAchievements?: string;
  sportsAchievements?: string;
  refereesJSON: string;
  cvDriveLink: string;
  createdAt?: Date;
  isReviewed?: boolean;
}

// =============================================
// Insert a new training application
// =============================================
export const createApplication = async (data: Application): Promise<boolean> => {
  try {
    const pool = getPool();
    const request = pool.request();

    request.input("fullName",            sql.NVarChar(500),     data.fullName);
    request.input("nameWithInitials",    sql.NVarChar(255),     data.nameWithInitials);
    request.input("address",             sql.NVarChar(sql.MAX), data.address);
    request.input("district",            sql.NVarChar(100),     data.district);
    request.input("mobile",              sql.NVarChar(50),      data.mobile);
    request.input("landline",            sql.NVarChar(50),      data.landline ?? null);
    request.input("dob",                 sql.Date,              data.dob);
    request.input("gender",              sql.NVarChar(20),      data.gender);
    request.input("civilStatus",         sql.NVarChar(50),      data.civilStatus);
    request.input("nic",                 sql.NVarChar(50),      data.nic);
    request.input("olYear",              sql.NVarChar(10),      data.olYear);
    request.input("olResultsJSON",       sql.NVarChar(sql.MAX), data.olResultsJSON);
    request.input("alYear",              sql.NVarChar(10),      data.alYear);
    request.input("alStream",            sql.NVarChar(100),     data.alStream);
    request.input("alResultsJSON",       sql.NVarChar(sql.MAX), data.alResultsJSON);
    request.input("trainingPreference",  sql.NVarChar(255),     data.trainingPreference);
    request.input("workExperienceJSON",  sql.NVarChar(sql.MAX), data.workExperienceJSON  ?? null);
    request.input("specialAchievements", sql.NVarChar(sql.MAX), data.specialAchievements ?? null);
    request.input("sportsAchievements",  sql.NVarChar(sql.MAX), data.sportsAchievements  ?? null);
    request.input("refereesJSON",        sql.NVarChar(sql.MAX), data.refereesJSON);
    request.input("cvDriveLink",         sql.NVarChar(sql.MAX), data.cvDriveLink ?? null);
    request.input("traineeNumber",       sql.NVarChar(100),     data.traineeNumber  ?? null);
    request.input("personalEmail",       sql.NVarChar(255),     data.personalEmail  ?? null);

    await request.query(`
      INSERT INTO [dbo].[TrainingApplications] (
        fullName, nameWithInitials, address, district, mobile, landline,
        dob, gender, civilStatus, nic,
        traineeNumber, personalEmail,
        olYear, olResultsJSON, alYear, alStream, alResultsJSON,
        trainingPreference, workExperienceJSON,
        specialAchievements, sportsAchievements,
        refereesJSON, cvDriveLink
      ) VALUES (
        @fullName, @nameWithInitials, @address, @district, @mobile, @landline,
        @dob, @gender, @civilStatus, @nic,
        @traineeNumber, @personalEmail,
        @olYear, @olResultsJSON, @alYear, @alStream, @alResultsJSON,
        @trainingPreference, @workExperienceJSON,
        @specialAchievements, @sportsAchievements,
        @refereesJSON, @cvDriveLink
      )
    `);

    return true;
  } catch (err) {
    console.error("❌ Database Insert Error (createApplication):", err);
    throw err;
  }
};

// =============================================
// Fetch all applications (admin view)
// =============================================
export const getAllApplications = async (): Promise<Application[]> => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM [dbo].[TrainingApplications] ORDER BY createdAt DESC");
    return result.recordset as Application[];
  } catch (err) {
    console.error("❌ Database Fetch Error (getAllApplications):", err);
    throw err;
  }
};

export const getApplicationByEmail = async (email: string): Promise<Application | null> => {
  const pool = getPool();
  const result = await pool.request()
    .input("email", sql.NVarChar(255), email.trim().toLowerCase())
    .query(`
      SELECT TOP 1 * FROM [dbo].[TrainingApplications]
      WHERE LOWER(LTRIM(RTRIM(personalEmail))) = @email
      ORDER BY createdAt DESC
    `);
  return result.recordset.length > 0 ? result.recordset[0] as Application : null;
};

export const deleteApplication = async (id: number): Promise<boolean> => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM [dbo].[TrainingApplications] WHERE id = @id");
    
    return (result.rowsAffected?.[0] ?? 0) > 0;
  } catch (err) {
    console.error("❌ Database Delete Error (deleteApplication):", err);
    throw err;
  }
};
