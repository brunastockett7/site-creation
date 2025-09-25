// utilities/validators.js
const { body, validationResult } = require("express-validator")

/** Collect cleaned values for sticky forms */
function pullClean(req) {
  return {
    // classification
    classification_name: req.body.classification_name?.trim(),

    // vehicle
    inv_make: req.body.inv_make?.trim(),
    inv_model: req.body.inv_model?.trim(),
    inv_year: req.body.inv_year,                 // toInt applied in rules
    inv_description: req.body.inv_description?.trim(),
    inv_image: req.body.inv_image?.trim(),
    inv_thumbnail: req.body.inv_thumbnail?.trim(),
    inv_price: req.body.inv_price,               // toFloat in rules
    inv_miles: req.body.inv_miles,               // toInt in rules
    inv_color: req.body.inv_color?.trim(),
    classification_id: req.body.classification_id // toInt in rules
  }
}

/** Rules for Add Classification */
function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3, max: 30 }).withMessage("3–30 characters required")
      .matches(/^[A-Za-z0-9]+$/).withMessage("Letters & numbers only (no spaces/specials)")
  ]
}

/** Rules for Add Vehicle */
function vehicleRules() {
  return [
    body("inv_make").trim().isLength({ min: 2, max: 50 }).withMessage("Make: 2–50 chars"),
    body("inv_model").trim().isLength({ min: 1, max: 50 }).withMessage("Model: required"),
    body("inv_year").toInt().isInt({ min: 1900, max: 2100 }).withMessage("Year: 1900–2100"),
    body("inv_description").trim().isLength({ min: 10 }).withMessage("Description: ≥ 10 chars"),
    body("inv_image")
      .trim()
      .matches(/^\/images\/[^ ]+\.(jpg|jpeg|png|webp)$/i)
      .withMessage("Image path must look like /images/file.webp"),
    body("inv_thumbnail")
      .trim()
      .matches(/^\/images\/[^ ]+\.(jpg|jpeg|png|webp)$/i)
      .withMessage("Thumbnail path must look like /images/file.webp"),
    body("inv_price").toFloat().isFloat({ min: 0 }).withMessage("Price must be ≥ 0"),
    body("inv_miles").toInt().isInt({ min: 0 }).withMessage("Miles must be ≥ 0"),
    body("inv_color").trim().matches(/^[A-Za-z ]{3,30}$/).withMessage("Color: letters/spaces, 3–30"),
    body("classification_id").toInt().isInt({ min: 1 }).withMessage("Choose a classification")
  ]
}

/** Run validation, attach errors + cleaned values; DO NOT redirect here */
function checkData(req, _res, next) {
  const result = validationResult(req)
  req.cleaned = pullClean(req)

  if (!result.isEmpty()) {
    // Map errors by field name so views can show them inline
    const map = {}
    for (const e of result.array()) {
      map[e.path] = e.msg
    }
    req.validationErrors = map
  } else {
    req.validationErrors = null
  }
  next()
}

module.exports = { classificationRules, vehicleRules, checkData }
