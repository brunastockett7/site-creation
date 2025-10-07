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

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.account_type = req.user?.role || null;
  next();
});

/* -------- Sessions -------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret",
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
    console.log("Nav classifications:", res.locals.nav.length);
  } catch (err) {
    console.error("Nav load failed:", err.message);
    res.locals.nav = [];
  }
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

app.get("/finance", (_req, res) => res.render("finance", { title: "Finance - CSE Motors" }));
app.get("/service", (_req, res) => res.render("service", { title: "Service & Maintenance - CSE Motors" }));
app.get("/privacy", (_req, res) => res.render("privacy", { title: "Privacy - CSE Motors" }));
app.get("/terms", (_req, res) => res.render("terms", { title: "Terms - CSE Motors" }));
app.get("/contact", (_req, res) => res.render("contact", { title: "Contact - CSE Motors" }));

/* -------- Routes -------- */
app.use("/inv", invRouter);
app.use("/auth", authRoutes);
app.use(accountRoutes);

/* -------- Redirect helpers -------- */
app.get("/login", (_req, res) => res.redirect("/auth/login"));
app.get("/register", (_req, res) => res.redirect("/auth/register"));

/* -------- Debug tools -------- */
app.get("/__debug/whoami", (req, res) => {
  res.json({
    cookies_present: Object.keys(req.cookies || {}),
    user_seen_by_middleware: res.locals.user || null
  });
});

app.get("/__viewtest", (_req, res) => {
  const fullManagePath = path.join(app.get("views"), "account", "manage.ejs");
  console.log("Looking for:", fullManagePath, "exists?", require("fs").existsSync(fullManagePath));
  res.render("account/manage", { errors: [], layout: false });
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
