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

/* ***************************
 *  Build Vehicle by inventory view
 * ************************** */

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

/* ***************************
 *  Build Vehicle Management View
 * ************************** */

invCont.buildVehicleManagement = async function(req, res){
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}


/* ***************************
 *  Build Inventory New Classification Form View
 * ************************** */

invCont.buildInventoryNewClassificationForm = async function(req, res){
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.newClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const newClassificationResult = await invModel.newClassification(classification_name)

  if (newClassificationResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${classification_name}.`
    )
    res.status(201).redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ***************************
 *  Build New Vehicle View
 * ************************** */

invCont.buildNewVehicleForm = async function(req, res){
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ****************************************
*  Process New Vehicle
* *************************************** */
invCont.newVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.newVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
}

module.exports = invCont