import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "Sathiya@123";
  const dbName = process.env.DB_NAME || "abwr_db";

  console.log(`Connecting to MySQL server at ${host} as ${user}...`);
  let connection;
  try {
    const ssl = host !== "localhost" && host !== "127.0.0.1" ? { minVersion: "TLSv1.2" } : undefined;
    connection = await mysql.createConnection({ host, user, password, ssl });
  } catch (err) {
    console.error("CRITICAL: Failed to connect to MySQL server. Ensure MySQL is running on your machine.", err.message);
    process.exit(1);
  }

  try {
    console.log(`Creating database "${dbName}" if it does not exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    console.log("Reading schema.sql file...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    // Split SQL by semicolons at the end of lines
    const statements = sql
      .split(/;\s*[\r\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements to build tables and seed default data...`);
    for (let statement of statements) {
      // Clean leading/trailing whitespaces and comment lines
      const lines = statement.split("\n");
      const cleanedLines = lines.filter(line => !line.trim().startsWith("--"));
      const cleanedStatement = cleanedLines.join("\n").trim();
      
      if (cleanedStatement.length === 0) continue;
      
      try {
        await connection.query(cleanedStatement);
      } catch (stmtErr) {
        // Ignore duplicate key entry errors from reseeding
        if (stmtErr.code !== "ER_DUP_ENTRY") {
          console.warn(`Notice: statement error: ${stmtErr.message}`);
        }
      }
    }

    console.log("MySQL Database build and data seeding completed successfully!");
  } catch (err) {
    console.error("Error setting up database tables:", err.message);
  } finally {
    await connection.end();
  }
}

run();
