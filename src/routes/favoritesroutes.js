/* eslint-env node */
const { Router } = require("express");
const { upsertValidators, listView, addAction, removeAction } =
require("../controllers/favoritescontroller");

const router = Router();

// /account/favorites (list)
router.get("/favorites", listView);

// /account/favorites/add
router.post("/favorites/add", upsertValidators, addAction);

// /account/favorites/remove
router.post("/favorites/remove", upsertValidators, removeAction);

module.exports = router;
