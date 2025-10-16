/* eslint-env node */
const { body, validationResult } = require("express-validator");
const favModel = require("../models/favoritesmodel");

// Validators
const upsertValidators = [
  body("inv_id").isInt({ min: 1 }).withMessage("Invalid vehicle id"),
];

async function listView(req, res, next) {
  try {
    const items = await favModel.listFavorites(req.user.id);
    return res.render("account/favorites", {
      title: "Saved Vehicles",
      items,
    });
  } catch (e) { next(e); }
}

async function addAction(req, res, next) {
  // server-side validation
  const errors = validationResult(req);
  const invId = Number(req.body.inv_id);
  const backTo = req.body.back || "/inventory";

  if (!errors.isEmpty()) {
    res.cookie("err", errors.array()[0].msg, { maxAge: 5000, httpOnly:
true, sameSite: "lax" });
    return res.redirect(backTo);
  }

  try {
    await favModel.addFavorite({ accountId: req.user.id, invId });
    res.cookie("notice", "Saved to your vehicles.", { maxAge: 5000,
httpOnly: true, sameSite: "lax" });
    return res.redirect(backTo);
  } catch (e) {
    console.error("addFavorite error:", e);
    res.cookie("err", "Could not save vehicle. Please try again.", {
maxAge: 5000, httpOnly: true, sameSite: "lax" });
    return res.redirect(backTo);
  }
}

async function removeAction(req, res, next) {
  const errors = validationResult(req);
  const invId = Number(req.body.inv_id);
  const backTo = req.body.back || "/account/favorites";

  if (!errors.isEmpty()) {
    res.cookie("err", errors.array()[0].msg, { maxAge: 5000, httpOnly:
true, sameSite: "lax" });
    return res.redirect(backTo);
  }

  try {
    await favModel.removeFavorite({ accountId: req.user.id, invId });
    res.cookie("notice", "Removed from saved vehicles.", { maxAge:
5000, httpOnly: true, sameSite: "lax" });
    return res.redirect(backTo);
  } catch (e) {
    console.error("removeFavorite error:", e);
    res.cookie("err", "Could not remove vehicle. Please try again.", {
maxAge: 5000, httpOnly: true, sameSite: "lax" });
    return res.redirect(backTo);
  }
}

module.exports = { upsertValidators, listView, addAction, removeAction };