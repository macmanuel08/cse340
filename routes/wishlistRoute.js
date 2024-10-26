const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const wishlistController = require("../controllers/wishlistController")
const validate = require("../utilities/wishlist-validation")

router.get(
    "/add/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(wishlistController.buildAddWishlist)
)

router.post(
    "/add",
    validate.idRules(),
    validate.checkWishlistData,
    utilities.handleErrors(wishlistController.addWishlist)
)

router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(wishlistController.buildWishlist)
)

router.get(
    "/remove/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(wishlistController.buildRemoveWishlist)
)

router.post(
    "/remove",
    validate.idRules(),
    validate.checkWishlistData,
    utilities.handleErrors(wishlistController.removeWishlist)
)

module.exports = router