/* eslint-env node */
const { body, validationResult } = require("express-validator");
const { getAccountById, updateAccount, updatePassword } = require("../models/accountmodel")

async function manageView(req, res) {
  try {
    const account = await getAccountById(req.user.id);
    res.render("account/manage", { account, pageTitle: "Account Management", errors: [] });
  } catch (err) {
    console.error("manageView error:", err.message);
    res.status(500).render("500", { title: "Server Error" });
  }
}

async function updateView(req, res) {
  try {
    const account = await getAccountById(req.user.id);
    res.render("account/update", { account, pageTitle: "Update Account", errors: [], success: null });
  } catch (err) {
    console.error("updateView error:", err.message);
    res.status(500).render("500", { title: "Server Error" });
  }
}

// ---- Validators (server-side) ----
const updateValidators = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email required"),
];

async function updateAccountAction(req, res) {
  const errors = validationResult(req);
  let account = await getAccountById(req.user.id);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("account/update", {
        account: { ...account, ...req.body },
        errors: errors.array().map((e) => e.msg),
        success: null,
        pageTitle: "Update Account",
      });
  }

  try {
    const updated = await updateAccount({ id: req.user.id, name: req.body.name, email: req.body.email });
    return res.render("account/update", {
      account: updated,
      errors: [],
      success: "Account updated",
      pageTitle: "Update Account",
    });
  } catch (err) {
    console.error("updateAccountAction error:", err.message);
    return res.status(500).render("500", { title: "Server Error" });
  }
}

const passwordValidators = [
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("confirm")
    .custom((val, { req }) => val === req.body.password)
    .withMessage("Passwords must match"),
];

async function updatePasswordAction(req, res) {
  const errors = validationResult(req);
  const account = await getAccountById(req.user.id);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("account/update", {
        account,
        errors: errors.array().map((e) => e.msg),
        success: null,
        pageTitle: "Update Account",
      });
  }

  try {
    await updatePassword({ id: req.user.id, newPassword: req.body.password });
    return res.render("account/update", {
      account,
      errors: [],
      success: "Password updated",
      pageTitle: "Update Account",
    });
  } catch (err) {
    console.error("updatePasswordAction error:", err.message);
    return res.status(500).render("500", { title: "Server Error" });
  }
}

module.exports = {
  manageView,
  updateView,
  updateValidators,
  updateAccountAction,
  passwordValidators,
  updatePasswordAction,
};
