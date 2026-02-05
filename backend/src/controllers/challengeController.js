const pool = require("../services/db");
const model = require("../models/challengeModel");

/* =====================================================
   READ ACTIVE CHALLENGES
===================================================== */
const readActiveChallengesForUser = (req, res) => {
  model.selectActiveChallengesForUser(
    { user_id: res.locals.userId },
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.status(200).json(results);
    }
  );
};

/* =====================================================
   COMPLETED COUNT
===================================================== */
const getCompletedCount = (req, res) => {
  model.countCompletedChallengesForUser(
    { user_id: res.locals.userId },
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.status(200).json({ completedChallenges: results[0].completedCount });
    }
  );
};

/* =====================================================
   CREATE CHALLENGE (FINAL FIXED VERSION)
===================================================== */
const createNewChallenge = (req, res) => {
  const { challenge, difficulty } = req.body;
  const userId = res.locals.userId;

  console.log("CREATE CHALLENGE BODY:", req.body); // 🔍 DEBUG

  // Validation
  if (!challenge || !difficulty) {
    return res.status(400).json({ message: "Missing challenge or difficulty" });
  }

  if (challenge.trim().length < 20) {
    return res.status(400).json({
      message: "Challenge description must be at least 20 characters"
    });
  }

  // Server-controlled difficulty → points
  const POINTS_MAP = {
    easy: 20,
    medium: 50,
    hard: 100
  };

  const skillpoints = POINTS_MAP[difficulty];
  if (!skillpoints) {
    return res.status(400).json({ message: "Invalid difficulty" });
  }

  // Insert challenge (difficulty INCLUDED ✅)
  model.insertSingle(
    {
      challenge: challenge.trim(),
      difficulty,
      skillpoints,
      creator_id: userId
    },
    (err, result) => {
      if (err) {
        console.error("Insert failed:", err);
        return res.status(500).json({ message: "Failed to create challenge" });
      }

      res.status(201).json({
        message: "Challenge created successfully",
        challenge_id: result.insertId,
        difficulty,
        skillpoints
      });
    }
  );
};

/* =====================================================
   COMPLETION FLOW
===================================================== */
const checkUserAndChallenge = (req, res, next) => {
  model.checkId(
    { user_id: res.locals.userId, challenge_id: req.params.challenge_id },
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "Invalid user/challenge" });
      }
      next();
    }
  );
};

const createNewCompletion = (req, res, next) => {
  model.insertCompletion(
    {
      challenge_id: req.params.challenge_id,
      user_id: res.locals.userId,
      completed: true,
      review_amt: req.body.review_amt,
      creation_date: new Date(),
      notes: req.body.notes
    },
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Already completed" });
        }
        return res.status(500).json(err);
      }
      res.locals.completeId = result.insertId;
      next();
    }
  );
};

const readChallengeSkillpoints = (req, res, next) => {
  model.selectSkillpoints(
    { user_id: res.locals.userId, challenge_id: req.params.challenge_id },
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.locals.challengePoints = results[0].challenge_skillpoints;
      res.locals.currentPoints = results[0].current_skillpoints;
      next();
    }
  );
};

const applySpellBonus = (req, res, next) => {
  pool.query(
    "SELECT active_spell_id, active_spell_uses FROM User WHERE user_id = ?",
    [res.locals.userId],
    (err, results) => {
      let multiplier = 1;

      if (
        results.length &&
        results[0].active_spell_id &&
        results[0].active_spell_uses > 0
      ) {
        multiplier = 1.2;

        pool.query(`
          UPDATE User
          SET 
            active_spell_uses = active_spell_uses - 1,
            active_spell_id = CASE 
              WHEN active_spell_uses - 1 <= 0 THEN NULL
              ELSE active_spell_id
            END
          WHERE user_id = ${res.locals.userId};
        `);
      }

      const earned = Math.floor(res.locals.challengePoints * multiplier);
      res.locals.totalPoints = res.locals.currentPoints + earned;
      next();
    }
  );
};

const updateUserSkillpoints = (req, res, next) => {
  model.updateUserSkillpoints(
    { user_id: res.locals.userId, totalPoints: res.locals.totalPoints },
    err => {
      if (err) return res.status(500).json(err);
      next();
    }
  );
};

const readCompletionById = (req, res) => {
  model.selectCompletionById(
    { completed_id: res.locals.completeId },
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json(results[0]);
    }
  );
};

const readCompletionByChallengeId = (req, res) => {
  model.selectCompletionByChallengeId(
    { challenge_id: req.params.challenge_id },
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(results);
    }
  );
};

/* =====================================================
   EXPORTS
===================================================== */
module.exports = {
  readActiveChallengesForUser,
  getCompletedCount,
  createNewChallenge,
  checkUserAndChallenge,
  createNewCompletion,
  readChallengeSkillpoints,
  applySpellBonus,
  updateUserSkillpoints,
  readCompletionById,
  readCompletionByChallengeId
};
