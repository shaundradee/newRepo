//Client-side validation for favorites forms
// Runs before the form is submitted to verify inv_id is positive integer (should always be, but just in case) and to confirm the user's intent to add/remove from favorites

const { parse } = require("dotenv");

function validateFavoriteForm(form) {
    const invId = parseInt(form.inv_id.value);
    if (!invId || invId < 1 || isNaN(invId)) {
        alert("Sorry, something went wrong with that vehicle. Please try again.");
        return false; // Prevent form submission
    }
    return true; // Allow form submission
}