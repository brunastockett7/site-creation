/* eslint-env node */
const bcrypt = require("bcryptjs");
const { query } = require("../db");

/** Create a new account (prepared statement) */
async function createAccount({ name, email, password_hash, role = "Client" }) {
  const { rows } = await query(
    `INSERT INTO accounts (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, password_hash, role]
  );
  return rows[0] || null;
}

/** Return limited public fields for a user by id */
async function getAccountById(id) {
  const { rows } = await query(
    "SELECT id, name, email, role FROM accounts WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

/** Return user including password hash for login by email */
async function getAccountByEmail(email) {
  const { rows } = await query(
    "SELECT id, name, email, role, password_hash FROM accounts WHERE email = $1",
    [email]
  );
  return rows[0] || null;
}

/** Update name + email; return updated public fields */
async function updateAccount({ id, name, email }) {
  const { rows } = await query(
    `UPDATE accounts
       SET name = $1,
           email = $2,
           updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, email, role`,
    [name, email, id]
  );
  return rows[0] || null;
}

/** Hash and update password */
async function updatePassword({ id, newPassword }) {
  const hash = await bcrypt.hash(newPassword, 10);
  const { rowCount } = await query(
    `UPDATE accounts
        SET password_hash = $1,
            updated_at = NOW()
      WHERE id = $2`,
    [hash, id]
  );
  return rowCount === 1;
}

module.exports = {
  createAccount,
  getAccountById,
  getAccountByEmail,
  updateAccount,
  updatePassword,
};
