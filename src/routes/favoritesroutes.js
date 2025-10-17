/* eslint-env node */
const { Router } = require("express");
// path is from src/routes -> src/controllers (one levelup)
const fav = require("../controllers/favoritesntroller");

console.log("favoritescontroller key:", Object.keys(fav));

const router = Router();

// List
router.get("/favorites", fav.listView);

// Add/ Remove (Spread the validator array)
router.post("/favorites/add", ...fav.upsertValidators, fav.addAction);
router.post("/favorites/remove", ...fav.upsertValidators, fav.removeAction);

module.exports = router;
