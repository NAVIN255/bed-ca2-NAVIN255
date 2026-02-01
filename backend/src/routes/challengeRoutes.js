const express = require("express");
const router = express.Router();

const challengeController = require("../controllers/challengeController");
const jwtMiddleware = require("../middleware/authMiddleware");

// ================================
// ALL challenge routes require auth
// ================================
router.use(jwtMiddleware.verifyToken);

// ----------------
// Challenges CRUD
// ----------------
router.get("/", challengeController.readAllChallenges);
router.get("/:challenge_id", challengeController.readChallengeById);
router.post("/", challengeController.createNewChallenge);
router.put("/:challenge_id", challengeController.updateChallengeById);
router.delete("/:challenge_id", challengeController.deleteChallengeById);

// ----------------------------
// Challenge Completions (CA1)
// ----------------------------
router.post(
    "/:challenge_id/completions",
    challengeController.checkUserAndChallenge,
    challengeController.createNewCompletion,
    challengeController.readChallengeSkillpoints,
    challengeController.updateUserSkillpoints,
    challengeController.readCompletionById
);

router.get(
    "/:challenge_id/completions",
    challengeController.readCompletionByChallengeId
);

module.exports = router;
