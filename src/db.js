/* eslint-env node */
// db.js (PROJECT ROOT)
const { Pool } = require("pg");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (!isProd) {
    console.log("DB:", text, "→", `${Date.now() - start}ms`, "rows:", res.rowCount);
  }
  return res;
}

module.exports = { pool, query };
