// ✅ Migration Script: Add traineeNumber and personalEmail columns to TrainingApplications table
// Run this script using: node src/migrations/addFieldsToApplications.js

const sql = require('mssql');
require('dotenv').config();

// Parse server and instance from DB_SERVER like ".\SQLEXPRESS"
const rawServer = process.env.DB_SERVER || '.\\SQLEXPRESS';
const parts = rawServer.split('\\');
const serverHost = parts[0] || 'localhost';
const instanceName = parts[1] || undefined;

const dbConfig = {
  server: serverHost,
  database: process.env.DB_NAME || 'TrainingCenterLMS',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: true,
    instanceName: instanceName,
  },
};

async function runMigration() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Connected to database');

    // Check and add traineeNumber column
    const checkTraineeNumber = await sql.query`
      SELECT *
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'TrainingApplications'
      AND COLUMN_NAME = 'traineeNumber'
    `;

    if (checkTraineeNumber.recordset.length === 0) {
      await sql.query`
        ALTER TABLE TrainingApplications
        ADD traineeNumber NVARCHAR(100) NULL
      `;
      console.log('✅ traineeNumber column added to TrainingApplications table');
    } else {
      console.log('ℹ️  traineeNumber column already exists');
    }

    // Check and add personalEmail column
    const checkPersonalEmail = await sql.query`
      SELECT *
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'TrainingApplications'
      AND COLUMN_NAME = 'personalEmail'
    `;

    if (checkPersonalEmail.recordset.length === 0) {
      await sql.query`
        ALTER TABLE TrainingApplications
        ADD personalEmail NVARCHAR(255) NULL
      `;
      console.log('✅ personalEmail column added to TrainingApplications table');
    } else {
      console.log('ℹ️  personalEmail column already exists');
    }

    console.log('✅ Migration completed successfully');
    await sql.close();
  } catch (err) {
    console.error('❌ Migration failed:', err.message || err);
    await sql.close();
    process.exit(1);
  }
}

runMigration();
