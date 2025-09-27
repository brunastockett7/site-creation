const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.PGHOST) {
  console.error("❌ PGHOST is not set. Check your .env file at the project root.");
  process.exit(1);
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
});

console.log(
  `🔌 DB target → host:${process.env.PGHOST} port:${process.env.PGPORT} db:${process.env.PGDATABASE}`
);

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
