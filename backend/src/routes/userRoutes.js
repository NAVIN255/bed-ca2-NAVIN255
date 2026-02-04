const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/authMiddleware');

// 🔐 Protect everything
router.use(jwtMiddleware.verifyToken);

// ===============================
// CURRENT USER
// ===============================
router.get('/profile', userController.getProfile);

// ===============================
// ADMIN / GENERIC
// ===============================
router.get('/', userController.readAllUsers);
router.get('/:user_id', userController.readUserById);
router.put('/:user_id', userController.updateUserById);
router.delete('/:user_id', userController.deleteUserById);

module.exports = router;