const express = require('express');
const router = express.Router();

const resourceController = require('../controllers/resourceController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/:user_id', resourceController.readUserResources);
router.post('/', resourceController.addUserResource);

module.exports = router;
