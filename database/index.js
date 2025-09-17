const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Check if we're in development or production environment
const isDev = process.env.NODE_ENV === "development";

// Create a new pool (database connection)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Connection string from .env
  ssl: isDev ? false : { rejectUnauthorized: false }, // SSL settings based on the environment
});

// Query function to interact with the database
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    console.log("executed query:", text); // Log executed query for debugging
    return res;
  } catch (err) {
    console.error("error in query:", text, err); // Log error if query fails
    throw err;
  }
}

module.exports = { pool, query };

