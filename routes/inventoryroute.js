const express = require("express");
const router = express.Router();
const invController = require("../controllers/invcontroller");

// Show hub page
router.get("/type", invController.classificationHub);

// Show inventory for a specific classification
router.get("/type/:classificationId", invController.listByClassification);

module.exports = router;
