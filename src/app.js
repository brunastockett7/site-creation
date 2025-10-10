/* eslint-env node */
/* eslint-disable no-console */

require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const { attachUser } = require("./middleware/auth");
const invRouter = require("./routes/inventoryroute");
const invModel = require("./models/inventory-model");
const authRoutes = require("./routes/authroutes");
const accountRoutes = require("./routes/accountroutes");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------- Static files & views -------- */
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

/* -------- Core middleware -------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret",  // Ensure this secret is defined in your .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

/* -------- Flash messages -------- */
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success")[0] || null;
  res.locals.error_message = req.flash("error")[0] || null;
  next();
});

/* -------- Global nav -------- */
app.use(async (_req, res, next) => {
  try {
    const rows = await invModel.getClassifications();
    res.locals.nav = rows || [];
    console.log("Nav classifications:", res.locals.nav.length);  // Debugging
  } catch (err) {
    console.error("Nav load failed:", err.message);
    res.locals.nav = [];
  }
  next();
});

/* -------- Session user handling -------- */
app.use((req, res, next) => {
  console.log("Session user:", req.session.user);  // Debugging session data
  res.locals.user = req.session.user || null;  // Pass session user to views
  res.locals.account_type = req.session.user?.role || null;  // Pass user role
  next();
});

/* -------- Public pages -------- */
app.get("/", (_req, res) =>
  res.render("index", {
    title: "CSE Motors — Home",
    description: "CSE Motors: curated inventory, flexible financing, and certified service.",
  })
);

app.get("/inventory", (_req, res) =>
  res.render("inventory", {
    title: "Inventory - CSE Motors",
    description: "Browse SUVs, sedans, and trucks. Transparent pricing.",
  })
);

// Add other routes...

/* -------- Routes -------- */
app.use("/inv", invRouter);
app.use("/auth", authRoutes);
app.use(accountRoutes);  // Make sure these routes are in correct order

/* -------- Apply the authRequired middleware to protect /account/manage route -------- */
app.use("/account/manage", authRequired);  // Protect /account/manage route

/* -------- Redirect helpers -------- */
app.get("/login", (_req, res) => res.redirect("/auth/login"));
app.get("/register", (_req, res) => res.redirect("/auth/register"));

/* -------- Debug tools -------- */
app.get("/__debug/whoami", (req, res) => {
  res.json({
    cookies_present: Object.keys(req.cookies || {}),
    user_seen_by_middleware: res.locals.user || null,  // Check session data in middleware
  });
});

/* -------- 404 + 500 -------- */
app.use((req, res) => {
  res.status(404).render("error/404", {
    title: "Page Not Found",
    description: "Sorry, we couldn’t find the page you were looking for.",
  });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).render("error/500", {
    title: "Server Error",
    description: "Something went wrong on our end.",
  });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
