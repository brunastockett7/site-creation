/* eslint-env node */
/* eslint-disable no-console */

require("dotenv").config();

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// middleware
const { attachUser } = require("./middleware/auth");

// --- Debugging the current directory ---
console.log("Current directory: ", __dirname);

// Routes & Models
const invRouter = require("./routes/inventoryroute");  // This should be the correct relative path
const invModel = require("./models/inventory-model");
const authRoutes = require("./routes/authroutes");
const accountRoutes = require("./routes/accountroutes");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------- Static files & views -------- */
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "views"));

/* -------- Core middleware -------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser); // ✅ after cookieParser, before routes

/* -------- Sessions -------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret", // use a secret string
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,  // ensures cookie is accessible only via HTTP(S), not JavaScript
      sameSite: "lax", // helps with cross-site request handling
    },
  })
);

// expose flash messages
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

/* -------- View engine -------- */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

/* -------- Global nav (classifications) -------- */
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

const fs = require("fs");
const fullManagePath = path.join(app.get("views"), "account", "manage.ejs");

app.get("/__viewtest", (_req, res) => {
  console.log("Looking for:", fullManagePath, "exists?", fs.existsSync(fullManagePath));
  res.render("account/manage", { errors: [], layout: false }); // no layout, isolates partials
});

// ✅ Add these two redirect helpers here (BEFORE 404 handler)
app.get("/login", (_req, res) => res.redirect("/auth/login"));
app.get("/register", (_req, res) => res.redirect("/auth/register"));

app.get("/__debug/whoami", (req, res) => {
  res.json({
    cookies_present: Object.keys(req.cookies || {}),
    user_seen_by_middleware: res.locals.user || null
  });
});

// --- Logout route ---
app.get("/logout", (req, res) => {
  console.log("Logout route triggered"); // This log helps you confirm if the route is being accessed
  
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err); // Log any error during session destruction
        return res.status(500).send("Error logging out");
      }

      // Clear the session cookie (default for express-session)
      res.clearCookie("connect.sid");

      // Optionally, clear the JWT cookie if you are using it
      res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });

      // Redirect to home or logout success page
      return res.redirect("/logout-success"); // Redirect to logout success page or home page
    });
  } else {
    // If no session exists, clear the cookies and redirect
    res.clearCookie("connect.sid");
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
    return res.redirect("/logout-success"); // Redirect to logout success page or home page
  }
});


/* -------- 404 + 500 (no view files) -------- */
app.use((req, res) => {
  res.status(404).type("text/plain").send("404 Not Found");
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).type("text/plain").send("500 Server Error");
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
