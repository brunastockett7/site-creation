const db = require("../db");

// Get all classifications
async function getClassifications() {
  const { rows } = await db.query(
    `SELECT classification_id, classification_name
     FROM classification
     ORDER BY classification_name`
  )
  return rows
}

/* ------------------------------
 * Get ALL vehicles (for hub /inv/type)
 * ------------------------------ */
async function getAllInventory() {
  const { rows } = await db.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image
     FROM inventory
     ORDER BY inv_year DESC, inv_make, inv_model`
  )
  return rows
}

// Get inventory by classification id (now includes miles)
async function getInventoryByClassification(classificationId) {
  const { rows } = await db.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image
     FROM inventory
     WHERE classification_id = $1
     ORDER BY inv_make, inv_model`,
    [classificationId]
  )
  return rows
}

// Get details for a single vehicle by inventory id
async function getVehicleById(invId) {
  const { rows } = await db.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price,
            inv_miles, inv_description, inv_image, inv_thumbnail, inv_color, classification_id
     FROM inventory
     WHERE inv_id = $1`,
    [invId]
  )
  return rows[0] // return just the single vehicle
}

/* ------------------------------
 * Insert classification
 * ------------------------------ */
async function insertClassification(classification_name) {
  const q = `INSERT INTO classification (classification_name)
             VALUES ($1) RETURNING classification_id`
  const { rows } = await db.query(q, [classification_name])
  return rows[0].classification_id
}

/* ------------------------------
 * Insert vehicle (uses inv_year + inv_miles)
 * ------------------------------ */
async function insertVehicle(v) {
  const q = `
    INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
       inv_price, inv_miles, inv_color, classification_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING inv_id
  `
  const vals = [
    v.inv_make,
    v.inv_model,
    Number(v.inv_year),
    v.inv_description,
    v.inv_image,
    v.inv_thumbnail,
    Number(v.inv_price),
    Number(v.inv_miles),
    v.inv_color,
    Number(v.classification_id),
  ]
  const { rows } = await db.query(q, vals)
  return rows[0].inv_id
}

/* ------------------------------
 * Featured vehicles (latest N)
 * ------------------------------ */
async function getFeatured(limit = 6) {
  const { rows } = await db.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image
     FROM inventory
     ORDER BY inv_id DESC
     LIMIT $1`,
    [limit]
  )
  return rows
}

// Export everything
module.exports = {
  getClassifications,
  getAllInventory,               // <-- added
  getInventoryByClassification,
  getVehicleById,
  insertClassification,
  insertVehicle,
  getFeatured,
}

