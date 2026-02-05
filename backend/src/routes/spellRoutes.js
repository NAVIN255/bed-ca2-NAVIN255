const express = require("express");
const router = express.Router();

const spellController = require("../controllers/spellController");
const jwtMiddleware = require("../middleware/authMiddleware");

router.use(jwtMiddleware.verifyToken);

router.get("/", spellController.readAllSpells);
router.post("/buy", spellController.buySpell);
router.post("/activate", spellController.activateSpell);

// ✅ THIS ROUTE MUST EXIST
router.get("/user", spellController.readUserSpells);

module.exports = router;
