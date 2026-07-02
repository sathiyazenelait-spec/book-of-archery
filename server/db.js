import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST || "localhost";
const ssl = host !== "localhost" && host !== "127.0.0.1" ? { minVersion: "TLSv1.2" } : undefined;

const pool = mysql.createPool({
  host,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Sathiya@123",
  database: process.env.DB_NAME || "abwr_db",
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
