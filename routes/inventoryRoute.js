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
router.get("/add-classification", invController.buildInventoryNewClassificationForm);
router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification)
)
router.get("/inventory", utilities.handleErrors(invController.buildNewVehicleForm))
router.post(
    "/inventory",
    classValidate.vehicleRules(),
    classValidate.checkVehicleData,
    utilities.handleErrors(invController.newVehicle)
)

module.exports = router;