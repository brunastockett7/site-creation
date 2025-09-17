const utilities = require("../utilities/")

const baseController = {}

/* ***********************
 *  Build home page
 *************************/
baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", {
      title: "CSE Motors — Home",
      description: "Shop, finance, and service with transparent pricing.",
      nav,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = baseController
