/* eslint-env node */
const { query } = require("../db");

// Add a favorite (keeps your current code)
async function addFavorite({ accountId, invId }) {
  const text = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING id, account_id, inv_id, created_at
  `;
  const { rows } = await query(text, [accountId, invId]);
  return rows[0] || null;
}

async function removeFavorite({ accountId, invId }) {
  const text = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`;
  const { rowCount } = await query(text, [accountId, invId]);
  return rowCount > 0;
}

// ✅ Return BOTH thumbnail and image
async function listFavorites(accountId) {
  const text = `
    SELECT
      f.inv_id,
      f.created_at,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_price,
      i.inv_thumbnail,
      i.inv_image         -- <== add this
    FROM favorites f
    JOIN inventory i ON i.inv_id = f.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `;
  const { rows } = await query(text, [accountId]);
  return rows;
}

module.exports = { addFavorite, removeFavorite, listFavorites };

// Remove a favorite
async function removeFavorite({ accountId, invId }) {
  const text = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`;
  const { rowCount } = await query(text, [accountId, invId]);
  return rowCount > 0;
}

// List a user’s favorites with vehicle details
async function listFavorites(accountId) {
  const text = `
    SELECT f.inv_id, f.created_at,
           i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail
    FROM favorites f
    JOIN inventory i ON i.inv_id = f.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `;
  const { rows } = await query(text, [accountId]);
  return rows;
}

// Helper to check if single vehicle is in user’s favorites
async function isFavorite({ accountId, invId }) {
  const text = `SELECT 1 FROM favorites WHERE account_id = $1 AND inv_id = $2`;
  const { rows } = await query(text, [accountId, invId]);
  return rows.length > 0;
}

module.exports = { addFavorite, removeFavorite, listFavorites, isFavorite };