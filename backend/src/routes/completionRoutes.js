const express = require('express');
const router = express.Router();

const completionController = require('../controllers/completionController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/', completionController.readAllCompletions);
router.get('/:complete_id', completionController.readCompletionById);
router.post('/', completionController.createCompletion);
router.put('/:complete_id', completionController.updateCompletion);
router.delete('/:complete_id', completionController.deleteCompletion);

module.exports = router;
