/* eslint-env node */
const { Pool } = require("pg");
require("dotenv").config();

// Pool connects automatically using DATABASE_URL from your .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (process.env.NODE_ENV !== "production") {
    console.log("DB:", text, "→", `${Date.now() - start}ms`, "rows:", res.rowCount);
  }
  return res;
}

module.exports = { pool, query };
