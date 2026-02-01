const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/', reviewController.readAllReviews);
router.post('/', reviewController.createReview);

module.exports = router;
