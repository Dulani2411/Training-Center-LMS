// ✅ Migration Script: Add password and email columns to Students table
// Run this script using: node src/migrations/addPasswordToStudents.js

const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function runMigration() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Connected to database');

    // Check and add password column
    const checkPassword = await sql.query`
      SELECT * 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Students' 
      AND COLUMN_NAME = 'password'
    `;

    if (checkPassword.recordset.length === 0) {
      await sql.query`
        ALTER TABLE Students
        ADD password NVARCHAR(255) NULL
      `;
      console.log('✅ Password column added to Students table');
    } else {
      console.log('ℹ️  Password column already exists');
    }

    // Check and add email column
    const checkEmail = await sql.query`
      SELECT * 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Students' 
      AND COLUMN_NAME = 'email'
    `;

    if (checkEmail.recordset.length === 0) {
      await sql.query`
        ALTER TABLE Students
        ADD email NVARCHAR(255) NULL
      `;
      
      // Add unique constraint on email
      await sql.query`
        CREATE UNIQUE INDEX IX_Students_Email ON Students(email) WHERE email IS NOT NULL
      `;
      console.log('✅ Email column added to Students table with unique constraint');
    } else {
      console.log('ℹ️  Email column already exists');
    }

    console.log('✅ Migration completed successfully');
    await sql.close();
  } catch (err) {
    console.error('❌ Migration failed:', err);
    await sql.close();
    process.exit(1);
  }
}

runMigration();

