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
router.get("/manage", authRequired, manageView);

// Update forms page
router.get("/update", authRequired, updateView);

// Update name/email
router.post("/update", authRequired, updateValidators, updateAccountAction);

// Update password
router.post("/password", authRequired, passwordValidators, updatePasswordAction);

module.exports = router;
