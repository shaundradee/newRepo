//Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");

//Route to buil login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route to register account
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;
