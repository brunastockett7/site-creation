/* eslint-env node */
const { Router } = require("express");
const { listView, add, remove } = require("../controllers/favoritescontroller");
// If you add validators later, import and insert them where noted.

const router = Router();

// GET /account/favorites
router.get("/favorites", listView);

// POST /account/favorites/add/:inv_id
router.post("/favorites/add/:inv_id", /* upsertValidators, */ add);

// POST /account/favorites/remove/:inv_id
router.post("/favorites/remove/:inv_id", /* upsertValidators, */ remove);

module.exports = router;
