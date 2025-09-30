const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Show hub page (/inv/type) – list ALL vehicles
 * *************************** */
async function classificationHub(_req, res, next) {
  try {
    const nav = await utilities.getNav()
    const items = await invModel.getAllInventory()
    res.render("inventory", {
      title: "Inventory — All Vehicles",
      description: "Browse all vehicles on the lot.",
      nav,
      items,
      utilities
    })
  } catch (e) {
    next(e)
  }
}

/* ***********************************************
 *  List vehicles for a specific classification
 * *********************************************** */
async function listByClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { classificationId } = req.params
    const items = await invModel.getInventoryByClassification(classificationId)

    res.render("inventory", {
      title: "Inventory",
      description: "Vehicles in this classification",
      nav,
      items,
      utilities
    })
  } catch (e) {
    next(e)
  }
}

/* ***********************
 *  Vehicle detail by ID
 * *********************** */
async function buildById(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { inv_id } = req.params
    const vehicle = await invModel.getVehicleById(inv_id)

    if (!vehicle) {
      return res.status(404).render("error", {
        status: 404,
        message: "Vehicle not found"
      })
    }

    const content = utilities.buildDetailView(vehicle)
    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      content
    })
  } catch (e) {
    next(e)
  }
}

/* ===============================
 *  Assignment 4 functions
 * =============================== */

/* Management hub view */
async function management(req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    const allVehicles = await invModel.getAllInventory();  // fetch all vehicles
    const recent = allVehicles.slice(0, 5);

    res.render("inventory/management", {
      title: "Inventory Management",
      nav: res.locals.nav,  // ✅ middleware already sets this
      flash: { success: req.flash("success"), error: req.flash("error") },
      notice: req.flash("notice"),
      classifications,
      recent,
      totalVehicles: allVehicles.length,  // ✅ add this line
      utilities,            // for formatPrice etc.
    });
  } catch (e) {
    next(e);
  }
}

/* Show Add Classification form */
async function showAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const flash = {
      error: (req.flash && req.flash("error")) || [],
      success: (req.flash && req.flash("success")) || []
    }
    // 🔧 FIXED PATH
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      flash,
      errors: req.validationErrors || {},
      values: { classification_name: (req.body && req.body.classification_name) || "" }
    })
  } catch (e) { next(e) }
}

/* Process Add Classification form */
async function addClassification(req, res, next) {
  try {
    if (req.validationErrors) return showAddClassification(req, res, next)
    const id = await invModel.insertClassification(req.cleaned.classification_name)
    req.flash && req.flash("success", `Classification created (ID ${id}).`)
    // ✅ Redirect so flash shows up on management page
    return res.redirect("/inv/management")
  } catch (e) {
    req.flash && req.flash("error", "Failed to create classification.")
    return showAddClassification(req, res, next)
  }
}

/* Show Add Vehicle form */
async function showAddVehicle(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const selected = req.body?.classification_id || null
    const classificationSelect = await utilities.buildClassificationList(selected)
    const flash = {
      error: (req.flash && req.flash("error")) || [],
      success: (req.flash && req.flash("success")) || []
    }
    // 🔧 FIXED PATH
    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      flash,
      classificationSelect,
      errors: req.validationErrors || {},
      values: req.body || {}
    })
  } catch (e) { next(e) }
}

/* Process Add Vehicle form */
async function addVehicle(req, res, next) {
  try {
    if (req.validationErrors) return showAddVehicle(req, res, next)
    const id = await invModel.insertVehicle(req.cleaned)
    req.flash && req.flash("success", `Vehicle created (ID ${id}).`)
    // ✅ Redirect back to management
    return res.redirect("/inv/management")
  } catch (e) {
    req.flash && req.flash("error", "Failed to create vehicle.")
    return showAddVehicle(req, res, next)
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
