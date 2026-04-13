// Needed Resources
const express = require('express');
const router = new express.Router();
const favCont = require("../controllers/favoritesController");
const utilities = require("../utilities/");
const favValidate = require("../utilities/favorite-validation");

// NOTE: checkLogin is used instead of checkAccountType because favorites should be available to all logged in users 

// Route to build favorites view
router.get("/", utilities.checkLogin, utilities.handleErrors(favCont.buildFavoritesView));

// POSTs are only available to logged in users
// Route to process adding a favorite 
router.post("/add", utilities.checkLogin, favValidate.favoriteRules(), favValidate.checkFavoriteData, utilities.handleErrors(favCont.addFavorite));

// Route to process removing a favorite
router.post("/remove", utilities.checkLogin, favValidate.favoriteRules(), favValidate.checkFavoriteData, utilities.handleErrors(favCont.removeFavorite));

module.exports = router;