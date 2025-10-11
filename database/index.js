// database/index.js
const { Pool } = require("pg");
require("dotenv").config();

// Detect production vs. local
const isProd = process.env.NODE_ENV === "production";

// Connect using the DATABASE_URL provided by Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false, // Required for Render Postgres
});

// Log connection info
console.log(`🔌 Connected to DB → ${process.env.DATABASE_URL || 'local database'}`);

async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error("DB query error:", text, err);
    throw err;
  }
}

module.exports = { pool, query };

