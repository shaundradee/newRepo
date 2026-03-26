// Password toggle functionality
    //may need to move this function to another file later- unsure where best to put this function
const passwordToggle = document.getElementById("password-toggle");
if (passwordToggle) {
    passwordToggle.addEventListener("change", function () {
        const passwordInput = document.getElementById("account_password");
        if (this.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
}