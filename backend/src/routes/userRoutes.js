const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/authMiddleware');

// Example: protect all user routes
router.use(jwtMiddleware.verifyToken);

// Get all users
router.get('/', userController.readAllUsers);

// Get user by ID
router.get('/:user_id', userController.readUserById);

// Update user
router.put('/:user_id', userController.updateUserById);

// Delete user
router.delete('/:user_id', userController.deleteUserById);

module.exports = router;
