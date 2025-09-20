const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Format price as USD
 ************************** */
Util.formatPrice = function (price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price)
}

/* ************************
 * Format mileage with commas + " miles"
 ************************** */
Util.formatMiles = function (miles) {
  if (miles == null) return "N/A"
  return `${new Intl.NumberFormat("en-US").format(miles)} miles`
}

/* ************************
 * Helper to slugify strings (for filenames)
 ************************** */
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

/* ************************
 * Resolve image path for a vehicle
 ************************** */
function resolveImagePath(vehicle) {
  const file = (vehicle.inv_image && vehicle.inv_image.trim())
    ? vehicle.inv_image.trim() // DB already has filename
    : `${slug(vehicle.inv_make)}-${slug(vehicle.inv_model)}-${vehicle.inv_year}.webp`
  return `/images/${file}` // served from /public/images/
}

/* ************************
 * Build vehicle detail view HTML
 ************************** */
Util.buildDetailView = function (vehicle) {
  const imgSrc = resolveImagePath(vehicle)
  return `
    <section class="vehicle-detail">
      <figure class="vehicle-media">
        <img src="${imgSrc}" alt="Photo of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
      </figure>
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${Util.formatPrice(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${Util.formatMiles(vehicle.inv_miles)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description ?? ""}</p>
      </div>
    </section>
  `
}

module.exports = Util
