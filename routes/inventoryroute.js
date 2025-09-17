const express = require("express")
const router = express.Router()
const invController = require("../controllers/invcontroller")

// Show hub page
router.get("/type", invController.classificationHub)

// Show inventory for a specific classification
router.get("/type/:classificationId", invController.listByClassification)

// Show vehicle detail for a specific vehicle
router.get("/detail/:inv_id", invController.buildById)

// Intentional error route (for Task 3 / rubric)
router.get("/trigger-500-error", (_req, _res, next) => {
  next(new Error("Intentional 500 error for testing"))
})

module.exports = router

