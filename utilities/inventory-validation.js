const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};


/*  **********************************
 *  Classification Management Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name must only contain letters and numbers — no spaces or special characters.")
    ]
};

/* ******************************
 * Check classification data and return error if not valid
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

/*  **********************************
 *  Inventory Management Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage("Please provide a make."),
    
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a model."),
        
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1900, max: 2099 })
        .withMessage("Please provide the year."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide image path."),

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide thumbnail path."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({min: 0})
        .withMessage("Please provide the price."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt({min: 0})
        .withMessage("Please provide the mileage."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color."),

        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification."),

    ]
};


/* ******************************
 * Check inventory data for validation
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id,
    } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let classificationList = await utilities.buildClassificationList(classification_id);
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            classificationList,
            nav,
            inv_make,
            inv_model, 
            inv_year, 
            inv_description,
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles,
            inv_color, 
            classification_id,
        });
        return;
    }
    next();
};


module.exports = validate;