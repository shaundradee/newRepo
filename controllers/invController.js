const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ************************
* Build inventory by classification view
************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : "No";
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
};

/* ************************
* Build inventory detail view
************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId;
    const vehicle = await invModel.getInventoryByInvId(inv_id);
    const detail = await utilities.buildVehicleDetail(vehicle);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
        title: vehicle.inv_make + " " + vehicle.inv_model,
        nav,
        detail,
    });
};

invCont.triggerError = async function (req, res, next) {
    throw new Error("Oh no! The engine blew up!");
};

/* ************************
* Build management view
************************** */
invCont.buildManagementView = async function(req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
};

/* ************************
* Build add inventory view
************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
    });
};

invCont.addInventory = async function (req, res, next) {
    const {
        inv_make, inv_model, inv_year, inv_description, inv_image,
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
    } = req.body;

    const regResult = await invModel.addInventory(
        inv_make, inv_model, inv_year, inv_description, inv_image,
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
    );

    if (regResult.rowCount) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        );
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, adding the inventory item failed.");
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
            inv_make, inv_model, inv_year, inv_description, inv_image,
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
        });
    }
};

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
};

invCont.addClassification = async function (req, res, next) {
    const {classification_name} = req.body;
    const regResults = await invModel.addClassification(classification_name);
    if (regResults) {
        req.flash("notice", `The ${classification_name} was added successfully.`);
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, adding the classification failed.");
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name,
        });
    };
};




module.exports = invCont;
