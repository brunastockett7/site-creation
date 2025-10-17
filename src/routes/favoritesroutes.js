/* eslint-env node */
const { Router } = require("express");
// path is from src/routes -> src/controllers (one levelup)
const fav = require("../controllers/favoritescontroller");

console.log("favoritescontroller key:", Object.keys(fav));

const router = Router();

// List
router.get("/favorites", fav.listView);

// Add/ Remove (Spread the validator array)
router.post("/favorites/add", upsertValidators, addAction);
router.post("/favorites/remove", upsertValidators, removeAction);

module.exports = router;
