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
    [invId]   // Prepared statement prevents SQL injection
  )
  return rows[0] // return just the single vehicle
}

module.exports = { 
  getClassifications, 
  getInventoryByClassification, 
  getVehicleById
}
