/* eslint-env node */
const { Router } = require("express");
const { authRequired } = require("../middleware/auth");
const {
  manageView,
  updateView,
  updateValidators,
  updateAccountAction,
  passwordValidators,
  updatePasswordAction,
} = require("../controllers/accountcontroller");

const router = Router();

// Account dashboard / greeting
router.get("/account/manage", authRequired, manageView);

// Update forms page
router.get("/account/update", authRequired, updateView);

// Update name/email
router.post("/account/update", authRequired, updateValidators, updateAccountAction);

// Update password
router.post("/account/password", authRequired, passwordValidators, updatePasswordAction);

module.exports = router;
