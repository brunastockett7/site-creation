const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Put it in .env at project root.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render requires SSL; this also works locally when connecting to Render DB
  ssl: { rejectUnauthorized: false },
});

// Log which database we are connecting to
try {
  const u = new URL(process.env.DATABASE_URL);
  console.log(`🔌 DB target → host:${u.hostname} port:${u.port} db:${u.pathname.slice(1)}`);
} catch (e) {
  console.log("⚠️ Could not parse DATABASE_URL");
}

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
