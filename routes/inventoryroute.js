// routes/inventoryroute.js
const express = require("express")
const router = express.Router()

// Controllers
const invController = require("../controllers/invcontroller")

// Validators (correct path)
const { classificationRules, vehicleRules, checkData } = require("../utilities/validators")

/* ===============================
 * Existing routes
 * =============================== */

// Hub (list classifications)
router.get("/type", invController.classificationHub)

// Inventory list for a classification
router.get("/type/:classificationId", invController.listByClassification)

// Vehicle detail by id
router.get("/detail/:inv_id", invController.buildById)

/* ===============================
 * Assignment 4 routes
 * =============================== */

// Management hub
router.get("/", invController.management)            // /inv/
router.get("/management", invController.management)  // /inv/management


// Add classification
router.get("/add-classification", invController.showAddClassification)
router.post(
  "/add-classification",
  classificationRules(),
  checkData,
  invController.addClassification
)

// Add vehicle
router.get("/add-vehicle", invController.showAddVehicle)
router.post(
  "/add-vehicle",
  vehicleRules(),
  checkData,
  invController.addVehicle
)

module.exports = router
