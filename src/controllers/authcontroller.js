/* eslint-env node */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccount, getAccountByEmail } = require("../models/accountmodel");

// Helpers
const isProd = process.env.NODE_ENV === "production";
const cookieOpts = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,                 // must be true only behind HTTPS
  maxAge: 1000 * 60 * 60,         // 1h
};

// Render login page
function loginView(req, res) {
  if (res.locals.user) return res.redirect("/account/manage");
  return res.render("account/login", {
    pageTitle: "Login — CSE Motors",
    errors: [],
    values: {},
  });
}

// Handle login form (JWT only)
async function login(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  try {
    const user = await getAccountByEmail(email);
    if (!user) {
      return res.status(401).render("account/login", {
        pageTitle: "Login — CSE Motors",
        errors: ["Invalid credentials."],
        values: { email },
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).render("account/login", {
        pageTitle: "Login — CSE Motors",
        errors: ["Invalid credentials."],
        values: { email },
      });
    }

    // Build JWT and set cookie
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1h",
    });

    res.cookie("jwt", token, cookieOpts);
    return res.redirect("/account/manage");
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).render("account/login", {
      pageTitle: "Login — CSE Motors",
      errors: ["Login failed. Please try again."],
      values: { email },
    });
  }
}

// Logout (clear JWT cookie)
function logout(_req, res) {
  res.clearCookie("jwt", { httpOnly: true, sameSite: cookieOpts.sameSite, secure: cookieOpts.secure });
  return res.redirect("/");
}

// Render Register page
function registerView(req, res) {
  if (res.locals.user) return res.redirect("/account/manage");
  return res.render("account/register", {
    pageTitle: "Create Account",
    errors: [],
    data: {},
  });
}

// Handle Register form (auto-login via JWT)
async function register(req, res) {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  const confirm = req.body.confirm || "";

  const errs = [];
  if (!name) errs.push("Name is required.");
  if (!email) errs.push("Email is required.");
  if (!password || password.length < 8) errs.push("Password must be at least 8 characters.");
  if (password !== confirm) errs.push("Passwords must match.");

  if (errs.length) {
    return res.status(400).render("account/register", {
      pageTitle: "Create Account",
      errors: errs,
      data: { name, email },
    });
  }

  try {
    const existing = await getAccountByEmail(email);
    if (existing) {
      return res.status(409).render("account/register", {
        pageTitle: "Create Account",
        errors: ["An account with that email already exists."],
        data: { name, email },
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const created = await createAccount({ name, email, password_hash, role: "Client" });
    console.log("New User Created:", created);

    const payload = { id: created.id, email: created.email, role: created.role, name: created.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1h",
    });

    res.cookie("jwt", token, cookieOpts);
    return res.redirect("/account/manage");
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).render("account/register", {
      pageTitle: "Create Account",
      errors: ["Something went wrong. Please try again."],
      data: { name, email },
    });
  }
}

module.exports = { loginView, login, logout, registerView, register };
