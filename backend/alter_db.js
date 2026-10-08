const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const dbConfig = {
  server: process.env.DB_SERVER || "localhost\\SQLEXPRESS",
  database: process.env.DB_NAME || "TrainingCenterLMS",
  options: {
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true,
  }
};

async function addColumn() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected.");
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'enrolledCourse'
      )
      BEGIN
        ALTER TABLE [dbo].[Students]
        ADD enrolledCourse NVARCHAR(255) NULL;
        PRINT 'Column added successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Column already exists.';
      END
    `);
    console.log("Done.");
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

addColumn();
