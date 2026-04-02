// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Intentional error route
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

//Manage view route
router.get("/",utilities.handleErrors(invController.buildManagementView));

// Add classification routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

//Add inventory routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;