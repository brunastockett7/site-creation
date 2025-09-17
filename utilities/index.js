const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => { // NOTE: your getClassifications already returns rows, no need for data.rows
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
 * Format mileage with commas
 ************************** */
Util.formatMiles = function (miles) {
  return `${new Intl.NumberFormat("en-US").format(miles)} miles`
}

/* ************************
 * Build vehicle detail view HTML
 ************************** */
Util.buildDetailView = function (vehicle) {
  return `
    <section class="vehicle-detail">
      <figure class="vehicle-media">
        <img src="${vehicle.inv_image}" alt="Photo of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
      </figure>
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${Util.formatPrice(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${Util.formatMiles(vehicle.inv_miles)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </section>
  `
}

module.exports = Util

