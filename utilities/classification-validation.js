const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a correct classification name."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to add/insert classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name
      })
      return
    }
    next()
}

/* **********************************
*  Vehicle Data Validation Rules
* ********************************* */
validate.vehicleRules = () => {
  return [
      body("classification_id")
      .notEmpty()
      .withMessage("Please select a correct classification name."), // on error this message is sent.

      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Please provide a make."),

      body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Please provide a model."),

      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

      body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid image path."),

      body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid thumbnail path."),

      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isFloat()
      .withMessage("Please provide a correct price in number or decimal. Don't include a $ sign."),

      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .isInt()
      .withMessage("Please provide a correct year."),

      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Please provide a correct miles."),

      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a color"),
  ]
}

/* ******************************
 * Check data and return errors or continue to add/insert vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    
    res.render("inventory/inventory", {
      errors,
      title: "Add New Classification",
      nav,
      classificationSelect,
      classification_id,
      inv_make, inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate