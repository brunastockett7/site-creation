const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors — Home",
    description: "Shop, finance, and service with transparent pricing."
  });
});

/* --------- NEW ROUTES (match your clickable cards) --------- */
app.get("/inventory", (req, res) => {
  res.render("inventory", {
    title: "Inventory — CSE Motors",
    description: "Browse cars with photos, details, and prices."
  });
});

app.get("/finance", (req, res) => {
  res.render("finance", {
    title: "Finance — CSE Motors",
    description: "See requirements and steps to get financed."
  });
});

app.get("/service", (req, res) => {
  res.render("service", {
    title: "Service — CSE Motors",
    description: "Quotes and booking for maintenance and repairs."
  });
});
/* ----------------------------------------------------------- */

app.get("/health", (_req, res) => res.status(200).send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));
