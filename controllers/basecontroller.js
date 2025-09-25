// controllers/basecontroller.js

const baseController = {}

/* Build Home (no DB calls so it never 500s) */
baseController.buildHome = function (_req, res) {
  // res.locals.nav is already set by your global nav middleware in server.js
  res.render("index", {
    title: "CSE Motors — Home",
    description: "Shop, finance, and service with transparent pricing.",
  })
}

module.exports = baseController
