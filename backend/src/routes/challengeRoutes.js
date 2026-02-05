const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");
const jwtMiddleware = require("../middleware/authMiddleware");

router.use(jwtMiddleware.verifyToken);

router.get("/", challengeController.readActiveChallengesForUser);
router.get("/completed/count", challengeController.getCompletedCount);

router.post("/", challengeController.createNewChallenge);

router.post(
  "/:challenge_id/completions",
  challengeController.checkUserAndChallenge,
  challengeController.createNewCompletion,
  challengeController.readChallengeSkillpoints,
  challengeController.applySpellBonus,
  challengeController.updateUserSkillpoints,
  challengeController.readCompletionById
);

router.get(
  "/:challenge_id/completions",
  challengeController.readCompletionByChallengeId
);

module.exports = router;
