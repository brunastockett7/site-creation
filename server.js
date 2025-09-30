/* eslint-env node */
/* eslint-disable no-undef */

// load environment variables first
require("dotenv").config();
try {
  const u = new URL(process.env.DATABASE_URL);
  console.log(`DB target → host:${u.hostname} port:${u.port} db:${u.pathname.slice(1)}`);
} catch {}

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const expressLayouts = require("express-ejs-layouts");

// NEW: sessions + flash for messages
const session = require("express-session");
const flash = require("connect-flash");

// controllers + routes
// controllers + routes
const inventoryroute = require("./routes/inventoryroute");
const basecontroller = require("./controllers/basecontroller");
const invcontroller = require("./controllers/invcontroller"); // ← ADD THIS LINE

// NEW: utilities for nav
const utilities = require("./utilities");

// NEW: database (for debug route)
const db = require("./database");

const app = express();

/* ------------------- SECURITY / HEADERS ------------------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        // Allow small inline scripts used by the forms' client-side validation.
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
      },
    },
  })
);

/* ------------------- LOGGING / STATIC / VIEWS ------------------- */
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

/* ------------------- BODY PARSING + SESSIONS + FLASH ------------------- */
// Parse URL-encoded form posts
app.use(express.urlencoded({ extended: true }));

// Sessions (needed for flash + login, etc.)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // enable when behind HTTPS only (Render prod)
    },
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
});

/* ------------------- GLOBAL NAV MIDDLEWARE -------------------*/

app.use(async (_req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav(); // build from DB
  } catch (e) {
    console.error("Nav build failed:", e.message);
    res.locals.nav = ""; // ✅ fallback so views don't crash
  }
  next();
});

/* ------------------- ROUTES ------------------- */

// Home (MVC via controller)
app.get("/", basecontroller.buildHome);

// Handle /inv/type (no id) → show all vehicles using your classificationHub
app.get("/inv/type", invcontroller.classificationHub);


// Inventory (MVC)
app.use("/inv", inventoryroute);

// Static views you already had
app.get("/finance", (_req, res) => {
  res.render("finance", {
    title: "Finance — CSE Motors",
    description: "See requirements and steps to get financed.",
  });
});

app.get("/service", (_req, res) => {
  res.render("service", {
    title: "Service — CSE Motors",
    description: "Quotes and booking for maintenance and repairs.",
  });
});

// Health check
app.get("/health", (_req, res) => res.status(200).send("OK"));

// 🔎 Debug DB route (temporary)
app.get("/debug/db", async (_req, res) => {
  try {
    const result = await db.query(
      "SELECT classification_id, classification_name FROM classification ORDER BY classification_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).send("DB connection failed: " + err.message);
  }
});

/* ------------------- ERROR HANDLERS ------------------- */

// 404 - Not Found
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    status: 404,
    message: "Page not found",
  });
});

// 500 - Server Error
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Server Error",
    status: 500,
    message: "Something went wrong on the server.",
  });
});

/* ------------------- START SERVER ------------------- */

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`\n🚗  Server running at http://localhost:${PORT}\n`);
});
