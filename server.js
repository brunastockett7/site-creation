/* eslint-env node */
/* eslint-disable no-undef */

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
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();

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
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.account_type = req.session.user?.role || null;
  res.locals.success_message = req.flash("success")[0] || null;
  res.locals.error_message = req.flash("error")[0] || null;
  next();
});

/* -------- Global Nav -------- */
const utilities = require("./utilities");
app.use(async (_req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (e) {
    console.error("Nav build failed:", e.message);
    res.locals.nav = "";
  }
  next();
});

/* -------- Routes -------- */
const basecontroller = require("./src/controllers/basecontroller");
const invcontroller = require("./src/controllers/invcontroller");
const inventoryroute = require("./src/routes/inventoryroute");
const authRoutes = require("./src/routes/authroutes");
const accountRoutes = require("./src/routes/accountroutes");

app.get("/", basecontroller.buildHome);
app.get("/inv/type", invcontroller.classificationHub);
app.use("/inv", inventoryroute);
app.use("/auth", authRoutes);
app.use(accountRoutes);

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

/* -------- Debug Tools -------- */
const db = require("./database");
app.get("/health", (_req, res) => res.status(200).send("OK"));
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
app.listen(PORT, () => {
  console.log(`\n🚗 Server running at http://localhost:${PORT}\n`);
});
