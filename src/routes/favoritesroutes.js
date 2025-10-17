/* eslint-env node */
const { Router } = require("express");
const {
  upsertValidators,
  listView,
  addAction,
  removeAction,
} = require("../controllers/favoritescontroller");  // ✅ destructure here

const router = Router();

router.get("/favorites", listView);
router.post("/favorites/add",    upsertValidators, addAction);
router.post("/favorites/remove", upsertValidators, removeAction);

module.exports = router;