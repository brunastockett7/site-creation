const db = require("../database")

// Get all classifications
async function getClassifications() {
  const { rows } = await db.query(
    `SELECT classification_id, classification_name
     FROM classification
     ORDER BY classification_name`
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
            inv_miles, inv_description, inv_image
     FROM inventory
     WHERE inv_id = $1`,
    [invId]
  )
  return rows[0] // return just the single vehicle
}

/* ------------------------------
 * NEW: Insert classification
 * ------------------------------ */
async function insertClassification(classification_name) {
  const q = `INSERT INTO classification (classification_name)
             VALUES ($1) RETURNING classification_id`
  const { rows } = await db.query(q, [classification_name])
  return rows[0].classification_id
}

/* ------------------------------
 * NEW: Insert vehicle
 * ------------------------------ */
async function insertVehicle(v) {
  const q = `
    INSERT INTO inventory
      (inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
       inv_price, inv_stock, inv_color, classification_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING inv_id
  `
  const vals = [
    v.inv_make, v.inv_model, v.inv_description, v.inv_image, v.inv_thumbnail,
    v.inv_price, v.inv_stock, v.inv_color, v.classification_id
  ]
  const { rows } = await db.query(q, vals)
  return rows[0].inv_id
}

// Export everything
module.exports = { 
  getClassifications, 
  getInventoryByClassification, 
  getVehicleById,
  insertClassification,   // <-- added
  insertVehicle           // <-- added
}
