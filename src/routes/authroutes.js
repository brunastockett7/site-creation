/* eslint-env node */
const { Router } = require("express");
const {
  loginView,
  login,
  logout,
  registerView,
  register
} = require("../controllers/authcontroller");

const router = Router();

// 🔹 Register routes (add these)
router.get("/register", registerView);
router.post("/register", register);

// 🔹 Existing login/logout routes (keep these)
router.get("/login", loginView);
router.post("/login", login);
router.post("/logout", logout);

// 🔹 Logout route
router.post("/logout", logout);  // This route calls the logout function in authcontroller.js

module.exports = router;
