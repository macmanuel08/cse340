// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route for accounts
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

// Route for update account view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account info update
router.post(
  "/update/info",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Process account password update
router.post(
  "/update/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updateAccountPassword)
)

// Process Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)
module.exports = router;