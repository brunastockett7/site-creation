const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Show hub page (no items yet)
 * *************************** */
async function classificationHub(_req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory", {
      title: "Inventory — Browse by Classification",
      description: "Choose a category from the navigation.",
      nav,
      items: [],          // nothing until a classification is picked
      utilities           // so inventory.ejs can call utilities.formatPrice
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
    // Model returns an array
    const items = await invModel.getInventoryByClassification(classificationId)

    res.render("inventory", {
      title: "Inventory",
      description: "Vehicles in this classification",
      nav,
      items,
      utilities // needed for utilities.formatPrice in inventory.ejs
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
    const { inv_id } = req.params   // ✅ FIX: match route param
    const vehicle = await invModel.getVehicleById(inv_id)

    if (!vehicle) {
      return res.status(404).render("error", {  // ✅ FIX: correct error view name
        status: 404,
        message: "Vehicle not found"
      })
    }

    const content = utilities.buildDetailView(vehicle)
    res.render("inventory/detail", {  // ✅ FIX: file in views/inventory/detail.ejs
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`, // show year too
      nav,
      content
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { classificationHub, listByClassification, buildById }
