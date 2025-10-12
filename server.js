
/* eslint-env node */
/* eslint-disable no-console */
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
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// ✅ correct imports/paths
const { query } = require("./src/db");
const utilities = require("./utilities");

const app = express();
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

/* -------- Security Headers -------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
      },
    },
  })
);

/* -------- Static Files & View Engine -------- */
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

/* -------- Core Middleware -------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Cookie-based flash (no sessions)
app.use((req, res, next) => {
  res.locals.success_message = req.cookies?.notice || null;
  res.locals.error_message   = req.cookies?.err || null;
  if (req.cookies?.notice) res.clearCookie("notice");
  if (req.cookies?.err)    res.clearCookie("err");
  next();
});

/* -------- JWT locals injector (for views) -------- */
app.use((req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
      res.locals.account_type = decoded.role || null;
    } catch {
      res.locals.user = null;
      res.locals.account_type = null;
    }
  } else {
    res.locals.user = null;
    res.locals.account_type = null;
  }
  next();
});

/* -------- Global Nav -------- */
app.use(async (_req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (e) {
    console.error("Nav build failed:", e.message);
    res.locals.nav = "";
  }
  next();
});

/* -------- JWT guard for /account/* -------- */
function requireAuth(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return res.redirect("/auth/login");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: false });
    return res.redirect("/auth/login");
  }
}

/* -------- Routes -------- */
const basecontroller = require("./src/controllers/basecontroller");
const invcontroller = require("./src/controllers/invcontroller");
const inventoryroute = require("./src/routes/inventoryroute");
const authRoutes = require("./src/routes/authroutes");
const accountRoutes = require("./src/routes/accountroutes");

app.get("/", basecontroller.buildHome);

// Public inventory hub + router
app.get("/inventory", invcontroller.classificationHub);
app.use("/inventory", inventoryroute);

// Auth
app.use("/auth", authRoutes);

// ✅ Protect everything under /account/*
app.use("/account", requireAuth, accountRoutes);

/* -------- Public Pages -------- */
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

/* -------- Redirect Helpers -------- */
app.get("/login", (_req, res) => res.redirect("/auth/login"));
app.get("/register", (_req, res) => res.redirect("/auth/register"));
// optional compatibility for old links
app.get("/inv", (_req, res) => res.redirect("/inventory"));

/* -------- Debug Tools -------- */
app.get("/health", (_req, res) => res.status(200).send("OK"));
app.get("/debug/db", async (_req, res) => {
  try {
    const result = await query(
      "SELECT classification_id, classification_name FROM classification ORDER BY classification_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).send("DB connection failed: " + err.message);
  }
});

app.get("/whoami", (req, res) => {
  res.json({ hasJwt: Boolean(req.cookies?.jwt), user: res.locals.user || null });
});

/* -------- Error Handlers -------- */
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

/* -------- Start Server -------- */
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
app.listen(PORT, HOST, () => {
  console.log(`🚗 Server running at http://${HOST}:${PORT}`);
});