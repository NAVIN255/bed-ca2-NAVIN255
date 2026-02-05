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
const classRoutes = require("./classRoutes");
const challengeRoutes = require("./challengeRoutes");
const studentRoutes = require("./studentRoutes");
const spellRoutes = require("./spellRoutes");
const ingredientRoutes = require("./ingredientRoutes");
const resourceRoutes = require("./resourceRoutes");
const reviewRoutes = require("./reviewRoutes");
const completionRoutes = require("./completionRoutes");
const userResourceRoutes = require("./userResourceRoutes");

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

// 👉 User profile (single source of truth)
router.get(
  "/users/profile",
  jwtMiddleware.verifyToken,
  userController.getProfile
);

// 👉 Feature modules
router.use("/users", jwtMiddleware.verifyToken, userRoutes);
router.use("/classes", jwtMiddleware.verifyToken, classRoutes);
router.use("/challenges", jwtMiddleware.verifyToken, challengeRoutes);
router.use("/students", jwtMiddleware.verifyToken, studentRoutes);
router.use("/spells", jwtMiddleware.verifyToken, spellRoutes);
router.use("/ingredients", jwtMiddleware.verifyToken, ingredientRoutes);
router.use("/resources", jwtMiddleware.verifyToken, resourceRoutes);
router.use("/reviews", jwtMiddleware.verifyToken, reviewRoutes);
router.use("/completions", jwtMiddleware.verifyToken, completionRoutes);
router.use("/user-resources", jwtMiddleware.verifyToken, userResourceRoutes);

module.exports = router;
