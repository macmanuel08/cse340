const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  console.log(req.body)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
  })
}

/* ****************************************
*  Deliver Update Account View
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByAccountId(account_id)
  res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccountInfo (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    req.flash("notice", `Account info for ${account_firstname} ${account_lastname} was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ***************************
 *  Update Account Password
 * ************************** */
async function updateAccountPassword (req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  let hashedPassword
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the password update.')
      const accountData = await accountModel.getAccountByAccountId(account_id)
      res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id
      })
    }

  const updateResult = await accountModel.updateAccountPassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", `Account password was successfully updated.`)
    res.redirect("/account/")
  } else {
    const accountData = await accountModel.getAccountByAccountId(account_id)
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id
    })
  }
}

/* ****************************************
*  Account logout and deliver login view
* *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.session.destroy(err => {
    if (err) {
        return res.status(500).send("Error in logging out");
    }

    res.locals.loggedin = false;
    res.redirect("/account/login");
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateAccount, updateAccountInfo, updateAccountPassword, accountLogout }