const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleByInventoryId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleByInventoryId(vehicle_id);
  const details = await utilities.buildVehicleDetails(data[0])
  let nav = await utilities.getNav()
  const vehicleTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/vehicle", {
      title: vehicleTitle,
      nav,
      details
  })
}

module.exports = invCont