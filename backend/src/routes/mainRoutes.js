const express = require('express');
const router = express.Router();

// ---------------------------
// Controllers & middleware
// ---------------------------
const userController = require('../controllers/userController');
const bcryptMiddleware = require('../middleware/hashMiddleware');
const jwtMiddleware = require('../middleware/authMiddleware');

// ---------------------------
// Feature route imports
// ---------------------------
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');
const challengeRoutes = require('./challengeRoutes');
const studentRoutes = require('./studentRoutes');
const spellRoutes = require('./spellRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const resourceRoutes = require('./resourceRoutes');
const reviewRoutes = require('./reviewRoutes');
const completionRoutes = require('./completionRoutes');
const userResourceRoutes = require('./userResourceRoutes');

// ===========================
// AUTH ROUTES (NO TOKEN)
// ===========================
router.post(
  "/login",
  userController.login,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.generateRefreshToken,
  jwtMiddleware.sendToken
);

router.post(
  "/register",
  userController.checkUsernameOrEmailExist,
  bcryptMiddleware.hashPassword,
  userController.register,
  bcryptMiddleware.hashPassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.generateRefreshToken,
  jwtMiddleware.sendToken
);

router.post(
  "/refresh",
  jwtMiddleware.refreshToken,
  jwtMiddleware.generateToken,
  jwtMiddleware.generateRefreshToken,
  jwtMiddleware.sendToken
);

// ===========================
// USER PROFILE (PROTECTED)
// ===========================
// 🔐 Get logged-in user's profile (NO userId in URL)
router.get(
  "/users/me",
  jwtMiddleware.verifyToken,
  userController.getMyProfile
);

// ===========================
// FEATURE ROUTES (PROTECTED)
// ===========================
router.use("/users", userRoutes);
router.use("/classes", classRoutes);
router.use("/challenges", challengeRoutes);
router.use("/students", studentRoutes);
router.use("/spells", spellRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/resources", resourceRoutes);
router.use("/reviews", reviewRoutes);
router.use("/completions", completionRoutes);
router.use("/user-resources", userResourceRoutes);

module.exports = router;