// For reference, the following are public and do not require authentication for reference:
// /type/:classificationId    *displays vehicles by classification (e.g., browsing "Sedan" vehicles). Site visitors need this.
// /detail/:invId    *displays details about a specific vehicle. Site visitors need this.
// /trigger-error    *intentionally triggers an error to test error handling. This is for testing purposes and should not be linked from the UI.
// /getInventory/:classification_id     *returns a JSON array of inventory items for a given classification_id. This is used by the inventory 
//      management view to dynamically load inventory items based on the selected classification. This is for internal use by the inventory 
//      management view and does not need to be linked from the UI.

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
router.get("/",utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Add classification routes
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", 
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

//Add inventory routes
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to get inventory items based on classification_id, used to populate inventory management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory));

// Route to process inventory update
router.post(
    "/update",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirmation));

// Route to process inventory deletion
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));


module.exports = router;