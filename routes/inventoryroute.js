// routes/inventoryroute.js
const express = require("express");
const router = express.Router();

// ⚠️ Case-sensitive on Linux/Render: make sure the file is named exactly "invController.js"
const invController = require("../controllers/invController");

// Hub (list classifications)
router.get("/type", invController.classificationHub);

// Inventory list for a classification
router.get("/type/:classificationId", invController.listByClassification);

// Vehicle detail by id
router.get("/detail/:inv_id", invController.buildById);

// Footer-triggered error for rubric (intentional 500)
router.get("/trigger-error", (_req, _res, next) => {
  next(new Error("Forced test error from footer link"));
});

module.exports = router;

