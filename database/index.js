const { Pool } = require("pg");
require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isDev ? { ssl: false } : { ssl: { rejectUnauthorized: false } }),
});

async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    console.log("executed query:", text);
    return res;
  } catch (err) {
    console.error("error in query:", text, err);
    throw err;
  }
}

module.exports = { pool, query };
