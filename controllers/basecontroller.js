const invModel = require("../models/inventory-model");

async function buildNavData() {
  return await invModel.getClassifications();
}

async function home(req, res, next) {
  try {
    const nav = await buildNavData();
    res.render("index", {
      title: "CSE Motors — Home",
      description: "Shop, finance, and service with transparent pricing.",
      nav,
    });
  } catch (e) { next(e); }
}

module.exports = { home, buildNavData };
