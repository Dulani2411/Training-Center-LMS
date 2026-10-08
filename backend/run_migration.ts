import { connectDB } from "./src/config/db";
import sql from "mssql/msnodesqlv8";
import fs from "fs";
import path from "path";

const runMigration = async () => {
  try {
    const config = {
      server: "localhost\\SQLEXPRESS",
      database: "TrainingCenterLMS",
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    };
    
    await sql.connect(config);
    console.log("Connected to MSSQL for migration");
    
    const migrationPath = path.join(__dirname, "migrations", "004_CREATE_APPLICATIONS_TABLE.sql");
    const query = fs.readFileSync(migrationPath, "utf8");
    
    console.log("Running migration...");
    await new sql.Request().query(query);
    console.log("Migration 004 applied successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigration();
