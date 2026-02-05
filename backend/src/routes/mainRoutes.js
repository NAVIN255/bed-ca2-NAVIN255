const express = require("express");
const router = express.Router();

// ---------------------------
// Controllers & middleware
// ---------------------------
const userController = require("../controllers/userController");
const bcryptMiddleware = require("../middleware/hashMiddleware");
const jwtMiddleware = require("../middleware/authMiddleware");

// ---------------------------
// Feature route imports
// ---------------------------
const userRoutes = require("./userRoutes");
const challengeRoutes = require("./challengeRoutes");
const completionRoutes = require("./completionRoutes");
const spellRoutes = require("./spellRoutes");

// ===========================
// AUTH ROUTES (PUBLIC)
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
// PROTECTED ROUTES
// ===========================

// 👉 User profile
router.get(
  "/users/profile",
  jwtMiddleware.verifyToken,
  userController.getProfile
);

// 👉 Core features
router.use("/users", jwtMiddleware.verifyToken, userRoutes);
router.use("/challenges", jwtMiddleware.verifyToken, challengeRoutes);
router.use("/completions", jwtMiddleware.verifyToken, completionRoutes);
router.use("/spells", jwtMiddleware.verifyToken, spellRoutes);

module.exports = router;
