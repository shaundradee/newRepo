/* *************************
* Require resources
* ************************* */
const {body, validationResult} = require("express-validator");
const validate = {};

/********************
* Favorite Data Validation Rules
******************** */
validate.favoriteRules = () => {
    return [
        // inv_id is required and must be an integer
        body("inv_id")
            .trim()
            .notEmpty()
            .isInt({min: 1})
            .withMessage("Sorry, that vehicle could not be favorited."),
    ];
};

/********************
* Check Favorite Data and Return Errors or Proceed
* --(the pattern below sends the user back to where they
*   came from with flash error message as a notice on the next
*   loaded page if there are validation errors, otherwise
*   it calls next() to proceed... there's no input from a form
*   to be "sticky"/preserved in this case)
******************** */
validate.checkFavoriteData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg).join(" "));
        // The above line takes all the validation error messages, combines them into a 
        // single string, and stores that string in a flash message under the key "notice". 
        // This allows you to display the error messages to the user on the next page they visit.
        // It couldbe broken down as follows:
        // const errorArray = errors.array(); // Get an array of error objects
        // const errorStrings = errorArray.map(function(error) { return error.msg; }); // Extract the message from each error object
        // const combinedMessage = errorStrings.join(" "); // Combine all messages into a single string
        // req.flash("notice", combinedMessage); // Store the combined message in a flash message
        return res.redirect("back");
        // The "back" argument in res.redirect("back") tells Express to redirect the user back to the page they came from.
    }
    next();
};

module.exports = validate;
