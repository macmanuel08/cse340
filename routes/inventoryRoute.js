// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const classValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.buildVehicleByInventoryId);
router.get("/", invController.buildVehicleManagement);
router.get(
    "/add-classification",
    utilities.checkAuthority,
    utilities.handleErrors(invController.buildInventoryNewClassificationForm)
);
router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification)
);
router.get(
    "/inventory",
    utilities.checkAuthority,
    utilities.handleErrors(invController.buildNewVehicleForm)
);
router.post(
    "/inventory",
    classValidate.vehicleRules(),
    classValidate.checkVehicleData,
    utilities.handleErrors(invController.newVehicle)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//route to edit inventory form
router.get(
    "/edit/:inv_id",
    utilities.checkAuthority,
    utilities.handleErrors(invController.editInventoryView)
);

// route to handle update request to the inventory
router.post(
    "/update/",
    classValidate.vehicleRules(),
    classValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// GET route to delete item from inventory view (for confirmation purpose)
router.get(
    "/delete/:inv_id",
    utilities.checkAuthority,
    utilities.handleErrors(invController.deleteInventoryView)
);

// POST route to delete item
router.post(
    "/delete/",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;