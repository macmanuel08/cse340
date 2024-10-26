const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
*  Validate inv_id and account_id
* ********************************* */
validate.idRules = () => {
    return [
        body("inv_id")
        .notEmpty()
        .isInt()
        .withMessage("Invalid Inventory ID"), // on error this message is sent.
  
        body("account_id")
        .notEmpty()
        .isInt()
        .withMessage("Invalid Account ID"),
    ]
}

/* ******************************
 * Check data and return errors or continue to add/insert wishlist
 * ***************************** */
validate.checkWishlistData = async (req, res, next) => {
    const { inv_id, account_id } = req.body
    const data = await invModel.getVehicleByInventoryId(inv_id);
    const details = await utilities.buildVehicleDetails(data[0])
    const loggedIn = res.locals.loggedin
    const vehicleTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const renderURL = `inv/detail/${inv_id}`
      res.render(renderURL, {
        errors,
        title: vehicleTitle,
        nav,
        details,
        inv_id,
        logged_in: loggedIn,
        addedToWishlist: false
      })
      return
    }
    next()
}

module.exports = validate