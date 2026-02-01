const express = require('express');
const router = express.Router();

const userResourceController = require('../controllers/userResourceController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/', userResourceController.readAllUserResources);
router.get('/:user_id', userResourceController.readUserResourcesByUserId);
router.post('/', userResourceController.addUserResource);
router.put('/:user_resource_id', userResourceController.updateUserResourceById);
router.delete('/:user_resource_id', userResourceController.deleteUserResourceById);

module.exports = router;
