const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const wishlistModel = require("../models/wishlist-model")

const wishlistController = {}

wishlistController.buildAddWishlist = async function(req, res) {
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const account_id = res.locals.accountData.account_id;
    const itemDataArray = await invModel.getVehicleByInventoryId(inv_id)
    const itemData = itemDataArray[0]
    res.render("wishlist/add", {
        title: "Confirm Addition to Wishlist",
        nav,
        errors: null,
        account_id,
        inv_id,
        model: itemData.inv_model,
        make: itemData.inv_make,
        year: itemData.inv_year,
        color: itemData.inv_color
    })
}

wishlistController.addWishlist = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, account_id} = req.body
    const result = wishlistModel.addWishlist(inv_id, account_id);

    if (result) {
        const nav = await utilities.getNav()
        const data = await invModel.getInventoryByWishlistAccountId(account_id)
        const grid = await utilities.buildClassificationGrid(data)
        req.flash("notice", `Wishlist addition successful`)
        res.render(
            "wishlist/wishlist", {
            nav,
            title: "Wishlist",
            errors: null,
            grid
        })
    } else {
        const renderURL = `/inv/detail/${inv_id}`
        const data = await invModel.getVehicleByInventoryId(inv_id)
        const details = await utilities.buildVehicleDetails(data[0])
        const addedToWishlistQuery = await wishlistModel.addedToWishlist(inv_id, account_id)
        const addedToWishlist = addedToWishlistQuery.rows.length === 1
        const loggedIn = res.locals.loggedin
        const vehicleTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

        req.flash("notice", "Sorry, the addition to wishlist failed.")
        res.status(501).render(renderURL, {
            errors,
            title: vehicleTitle,
            nav,
            details,
            inv_id,
            logged_in: loggedIn,
            addedToWishlist
        })
    }
}

wishlistController.buildWishlist = async function(req, res) {
    const nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id;
    const data = await invModel.getInventoryByWishlistAccountId(account_id)
    const grid = await utilities.buildClassificationGrid(data);
    res.render(
        "wishlist/wishlist", {
        nav,
        title: "Wishlist",
        errors: null,
        grid
    })
}

wishlistController.buildRemoveWishlist = async function(req, res) {
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const account_id = res.locals.accountData.account_id;
    const itemDataArray = await invModel.getVehicleByInventoryId(inv_id)
    const itemData = itemDataArray[0]
    res.render("wishlist/remove", {
        title: "Confirm Removal from Wishlist",
        nav,
        errors: null,
        account_id,
        inv_id,
        model: itemData.inv_model,
        make: itemData.inv_make,
        year: itemData.inv_year,
        color: itemData.inv_color
    })
}

wishlistController.removeWishlist = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, account_id} = req.body
    const result = wishlistModel.removeWishlist(inv_id, account_id);

    if (result) {
        const nav = await utilities.getNav()
        const data = await invModel.getInventoryByWishlistAccountId(account_id)
        const grid = await utilities.buildClassificationGrid(data)
        req.flash("notice", `Wishlist removal of the item successful`)
        res.render(
            "wishlist/wishlist", {
            nav,
            title: "Wishlist",
            errors: null,
            grid
        })
    } else {
        const renderURL = `/inv/detail/${inv_id}`
        const data = await invModel.getVehicleByInventoryId(inv_id)
        const details = await utilities.buildVehicleDetails(data[0])
        const addedToWishlistQuery = await wishlistModel.addedToWishlist(inv_id, account_id)
        const addedToWishlist = addedToWishlistQuery.rows.length === 1
        const loggedIn = res.locals.loggedin
        const vehicleTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

        req.flash("notice", "Sorry, the removal to wishlist failed.")
        res.status(501).render(renderURL, {
            errors,
            title: vehicleTitle,
            nav,
            details,
            inv_id,
            logged_in: loggedIn,
            addedToWishlist
        })
    }
}

module.exports = wishlistController