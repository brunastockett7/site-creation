/* eslint-env node */
const { Pool } = require("pg");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

// ✅ Use DATABASE_URL for both local and Render connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false, // required for Render
});

// ✅ Safe, consistent query wrapper with timing logs
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (!isProd) {
    console.log(
      "DB:",
      text,
      "→",
      `${Date.now() - start}ms`,
      "rows:",
      res.rowCount
    );
  }
  return res;
}

module.exports = { pool, query };
