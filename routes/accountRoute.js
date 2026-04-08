//Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require('../utilities/account-validation')


//Route to buil login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route to register account
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

//Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Route to process account update
router.post("/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

// Route to process password update/change
router.post("/update-password",
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

// Route to process logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
