const invModel = require("../models/inventory-model")
const utilities = require("../../utilities")

/* ===============================
 *  Public: Hub (all vehicles)
 * =============================== */
async function classificationHub(_req, res, next) {
  try {
    const items = await invModel.getAllInventory()
    res.render("inventory", {
      title: "Inventory — All Vehicles",
      description: "Browse all vehicles on the lot.",
      // nav comes from res.locals.nav (middleware)
      items,
      utilities
    })
  } catch (e) { next(e) }
}

/* ==========================================
 *  Public: List vehicles by classification
 * ========================================== */
async function listByClassification(req, res, next) {
  try {
    const { classificationId } = req.params
    const items = await invModel.getInventoryByClassification(Number(classificationId))
    res.render("inventory", {
      title: "Inventory",
      description: "Vehicles in this classification",
      items,
      utilities
    })
  } catch (e) { next(e) }
}

/* ===========================
 *  Public: Vehicle detail
 * =========================== */
async function buildById(req, res, next) {
  try {
    const { inv_id } = req.params
    const vehicle = await invModel.getVehicleById(Number(inv_id))
    if (!vehicle) {
      return res.status(404).render("error", { status: 404, message: "Vehicle not found" })
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle  // pass the object directly to the view
    })
  } catch (e) { next(e) }
}


/* ===============================
 *  W04: Management hub view
 * =============================== */
async function management(_req, res, next) {
  try {
    const classifications = await invModel.getClassifications()
    const allVehicles = await invModel.getAllInventory()
    const recent = allVehicles.slice(0, 5)
    res.render("inventory/management", {
      title: "Inventory Management",
      classifications,
      recent,
      totalVehicles: allVehicles.length,
      utilities
    })
  } catch (e) { next(e) }
}

/* ===============================
 *  W04: Add Classification (GET)
 * =============================== */
async function showAddClassification(req, res, next) {
  try {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: req.validationErrors || null,
      values: {
        classification_name: (req.body && req.body.classification_name) || ""
      }
    })
  } catch (e) { next(e) }
}

/* ===============================
 *  W04: Add Classification (POST)
 * =============================== */
async function addClassification(req, res, next) {
  try {
    if (req.validationErrors) {
      // sticky form on validation fail
      return res.status(400).render("inventory/add-classification", {
        title: "Add Classification",
        errors: req.validationErrors,
        values: req.body || {}
      })
    }

    const id = await invModel.insertClassification(req.cleaned.classification_name.trim())
    if (id) {
      req.session.flash = "Classification added successfully."
      return res.redirect("/inv/management")
    }
    req.session.flash = "Sorry, adding classification failed."
    return res.redirect("/inv/add-classification")
  } catch (e) {
    console.error("addClassification error:", e)
    req.session.flash = "Unexpected error. Please try again."
    return res.redirect("/inv/add-classification")
  }
}

/* ===========================
 *  W04: Add Vehicle (GET)
 * =========================== */
async function showAddVehicle(req, res, next) {
  try {
    const selected = req.body?.classification_id || null
    const classificationSelect = await utilities.buildClassificationList(selected)
    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      classificationSelect,
      errors: req.validationErrors || null,
      values: {
        inv_image: "/images/no-image.png",
        inv_thumbnail: "/images/no-image-tn.png",
        ...(req.body || {})
      }
    })
  } catch (e) { next(e) }
}

/* ===========================
 *  W04: Add Vehicle (POST)
 * =========================== */
async function addVehicle(req, res, next) {
  try {
    if (req.validationErrors) {
      const classificationSelect = await utilities.buildClassificationList(req.body?.classification_id)
      return res.status(400).render("inventory/add-vehicle", {
        title: "Add Vehicle",
        classificationSelect,
        errors: req.validationErrors,
        values: req.body || {}
      })
    }

    // coerce types (Data Types rubric)
    const payload = {
      inv_make: req.cleaned.inv_make.trim(),
      inv_model: req.cleaned.inv_model.trim(),
      inv_year: Number(req.cleaned.inv_year),
      inv_description: req.cleaned.inv_description.trim(),
      inv_image: req.cleaned.inv_image.trim(),
      inv_thumbnail: req.cleaned.inv_thumbnail.trim(),
      inv_price: Number(req.cleaned.inv_price),
      inv_miles: Number(req.cleaned.inv_miles),
      inv_color: req.cleaned.inv_color.trim(),
      classification_id: Number(req.cleaned.classification_id)
    }

    const id = await invModel.insertVehicle(payload)
    if (id) {
      req.session.flash = "Vehicle added successfully."
      return res.redirect("/inv/management")
    }
    req.session.flash = "Vehicle insert failed."
    return res.redirect("/inv/add-vehicle")
  } catch (e) {
    console.error("addVehicle error:", e)
    req.session.flash = "Unexpected error. Please try again."
    return res.redirect("/inv/add-vehicle")
  }
}

/* ===============================
 *  Exports
 * =============================== */
module.exports = {
  classificationHub,
  listByClassification,
  buildById,
  management,
  showAddClassification,
  addClassification,
  showAddVehicle,
  addVehicle
}
