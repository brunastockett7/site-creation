// utilities/index.js
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Build the top nav (<ul>...</ul>)
 * Safe to render even if DB fails.
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let list = '<ul class="nav-list">'
    list += '<li><a href="/" title="Home">Home</a></li>'
    list += '<li><a href="/inv/type" title="Inventory hub">Inventory</a></li>'
    list += '<li><a href="/finance" title="Financing options">Finance</a></li>'
    list += '<li><a href="/service" title="Service center">Service</a></li>'
    data.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}"
                 title="See ${row.classification_name} inventory">
                 ${row.classification_name}</a></li>`
    })
    list += "</ul>"
    return list
  } catch {
    return '<ul class="nav-list"><li><a href="/">Home</a></li><li><a href="/inv/type">Inventory</a></li><li><a href="/finance">Finance</a></li><li><a href="/service">Service</a></li></ul>'
  }
}

/* ************************
 * Build the classifications <select> (sticky)
 ************************** */
Util.buildClassificationList = async function (selectedId = null) {
  const rows = await invModel.getClassifications()
  let html = `<select name="classification_id" id="classificationList" required>`
  html += `<option value="">Choose a Classification</option>`
  for (const r of rows) {
    const sel =
      selectedId != null && String(selectedId) === String(r.classification_id)
        ? " selected"
        : ""
    html += `<option value="${r.classification_id}"${sel}>${r.classification_name}</option>`
  }
  html += `</select>`
  return html
}

/* ************************
 * Format price as USD
 ************************** */
Util.formatPrice = function (price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
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
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/* ************************
 * Resolve image path for a vehicle
 ************************** */
function resolveImagePath(vehicle) {
  const file =
    vehicle.inv_image && vehicle.inv_image.trim()
      ? vehicle.inv_image.trim() // DB already has filename/path
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

