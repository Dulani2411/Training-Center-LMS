import sql from "mssql/msnodesqlv8";
import dotenv from "dotenv";

dotenv.config();

// =============================================
// MSSQL Connection Configuration
// Reads from .env — uses Windows Auth (Trusted)
// =============================================
const dbConfig: sql.config = {
  server: process.env.DB_SERVER || "localhost\\SQLEXPRESS",
  database: process.env.DB_NAME || "TrainingCenterLMS",
  options: {
    trustedConnection: process.env.DB_TRUSTED_CONNECTION !== "false",
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== "false",
    enableArithAbort: true,
  },
  pool: {
    max: 10,       // max connections in pool
    min: 0,        // min connections kept alive
    idleTimeoutMillis: 30000, // close idle connections after 30s
  },
  connectionTimeout: 15000,  // 15s to establish connection
  requestTimeout: 30000,     // 30s per query
};

// =============================================
// Global connection pool (reused across requests)
// =============================================
let pool: sql.ConnectionPool | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    pool = await sql.connect(dbConfig);

    pool.on("error", (err: Error) => {
      console.error("❌ MSSQL Pool error:", err);
    });

    console.log(
      `✅ Connected to MSSQL — Server: ${dbConfig.server} | DB: ${dbConfig.database}`
    );
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    // Exit process so the container/PM2 restarts cleanly
    process.exit(1);
  }
};

// =============================================
// Helper: get the active pool (use in routes/services)
// Usage: const pool = getPool();
//        const result = await pool.request().query("SELECT 1");
// =============================================
export const getPool = (): sql.ConnectionPool => {
  if (!pool || !pool.connected) {
    throw new Error(
      "Database pool is not initialised. Call connectDB() first."
    );
  }
  return pool;
};

// Export raw sql for parameterised queries (sql.Int, sql.NVarChar, etc.)
export default sql;
