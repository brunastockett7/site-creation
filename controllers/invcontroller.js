const invModel = require("../models/inventory-model.js");
const { buildNavData } = require("./basecontroller");

async function classificationHub(_req, res, next) {
  try {
    const nav = await buildNavData();
    res.render("inventory", {
      title: "Inventory — Browse by Classification",
      description: "Choose a category from the navigation.",
      nav,
      items: [], // nothing yet until a classification is picked
    });
  } catch (e) { next(e); }
}

async function listByClassification(req, res, next) {
  try {
    const nav = await buildNavData();
    const items = await invModel.getInventoryByClassification(req.params.classificationId);
    res.render("inventory", {
      title: "Inventory",
      description: "Vehicles in this classification",
      nav,
      items,
    });
  } catch (e) { next(e); }
}

module.exports = { classificationHub, listByClassification };
