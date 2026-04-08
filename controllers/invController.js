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

/* ************************
* Trigger intentional error
************************** */
invCont.triggerError = async function (req, res, next) {
    throw new Error("Oh no! The engine blew up!");
};

/* ************************
* Build management view
************************** */
invCont.buildManagementView = async function(req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationList,
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

/* ************************
* Process add inventory form
************************** */
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
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationList,
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

/* ************************
* Build add classification view
************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
};

/* ************************
* Process add classification form
************************** */
invCont.addClassification = async function (req, res, next) {
    const {classification_name} = req.body;
    const regResults = await invModel.addClassification(classification_name);
    if (regResults) {
        req.flash("notice", `The ${classification_name} was added successfully.`);
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationList,
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error("No data returned"));
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const classificationList = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
  });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,  
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
    }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    });
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
        req.flash("notice", "The vehicle was successfully deleted.");
        res.redirect("/inv/");
    } else {
        req.flash("notice", "Sorry, the delete failed.");
        res.redirect("/inv/delete/" + inv_id);
    }
}


module.exports = invCont;
