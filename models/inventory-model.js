const db = require("../database");

async function getClassifications() {
  const { rows } = await db.query(
    `SELECT classification_id, classification_name
     FROM classification
     ORDER BY classification_name`
  );
  return rows;
}

async function getInventoryByClassification(classificationId) {
  const { rows } = await db.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price
     FROM inventory
     WHERE classification_id = $1
     ORDER BY inv_make, inv_model`,
    [classificationId]
  );
  return rows;
}

module.exports = { getClassifications, getInventoryByClassification };
