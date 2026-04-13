// controller is the "traffic cop" between the routes, the model, and the views

/* *************************
* Required Resources
* ************************* */
const utilities = require("../utilities/");
const favoriteModel = require("../models/favorite-model");
const favCont = {};

/* *************************
* Process Add Favorite Request
* ************************* */
favCont.addFavorite = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);  // Convert the inv_id from the request body to an integer (validation already confirmed it's a valid int, but req.body always gives strings)
    const account_id = res.locals.accountData.account_id; // pulls the user's ID from the JWT (set by checkJWTToken middleware in utilities/index.js:131)
    const data = await favoriteModel.addFavorite(account_id, inv_id);
    console.log("Add Favorite Result:", data); // Log the result of the addFavorite operation for debugging
    if (data) {
        req.flash("notice", "Vehicle added to favorites.");
    } else {
        req.flash("notice", "Sorry, the vehicle could not be favorited.");
    }
    res.redirect("/inv/detail/" + inv_id);
};

/* *************************
* Process Remove Favorite 
*   (almost identical to addFavorite)
* ************************* */
favCont.removeFavorite = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);
    const account_id = res.locals.accountData.account_id;
    const data = await favoriteModel.removeFavorite(account_id, inv_id);
    if (data) {
        req.flash("notice", "Vehicle removed from favorites.");
    } else {
        req.flash("notice", "Sorry, the vehicle could not be removed from favorites.");
    }

    // Determine where to redirect based on the source of the request (detail page or favorites page)
    if (req.body.source === "detail") {
        res.redirect("/inv/detail/" + inv_id);
    } else {
        res.redirect("/favorites/");
    }
};

/* *************************
* Build Favorites View
* ************************* */
favCont.buildFavoritesView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoriteModel.getFavoritesByAccountId(account_id);
    const grid = await utilities.buildFavoritesGrid(favorites);
    res.render("account/my-favorites", {
        title: "My Favorites",
        nav,
        grid,
        errors: null,
    });
};

module.exports = favCont;