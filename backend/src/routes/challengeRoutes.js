const express = require("express");
const router = express.Router();

const challengeController = require("../controllers/challengeController");
const jwtMiddleware = require("../middleware/authMiddleware");

// ================================
// ALL challenge routes require auth
// ================================
router.use(jwtMiddleware.verifyToken);

// ----------------
// Active challenges
// ----------------
router.get(
  '/',
  challengeController.readActiveChallengesForUser
);

// ----------------
// Completed challenge count
// ----------------
router.get(
  '/completed/count',
  challengeController.getCompletedCount
);

// ----------------
// Challenges CRUD
// ----------------
router.get("/:challenge_id", challengeController.readChallengeById);
router.post("/", challengeController.createNewChallenge);
router.put("/:challenge_id", challengeController.updateChallengeById);
router.delete("/:challenge_id", challengeController.deleteChallengeById);

// ----------------------------
// Challenge Completions
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