const express = require("express");
const router = express.Router();

const spellController = require("../controllers/spellController");
const jwtMiddleware = require("../middleware/authMiddleware");

// 🔐 Protect all spell routes
router.use(jwtMiddleware.verifyToken);

// ===============================
// SPELL SHOP
// ===============================

// View all spells
router.get("/", spellController.readAllSpells);

// Buy spell (deduct points)
router.post("/buy", spellController.buySpell);

// Activate spell (3 uses)
router.post("/activate", spellController.activateSpell);

module.exports = router;
