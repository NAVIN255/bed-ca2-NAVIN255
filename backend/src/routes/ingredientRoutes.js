const express = require('express');
const router = express.Router();

const ingredientController = require('../controllers/ingredientController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/', ingredientController.readAllIngredients);
router.get('/:ingredient_id', ingredientController.readIngredientById);
router.post('/', ingredientController.createIngredient);
router.put('/:ingredient_id', ingredientController.updateIngredientById);
router.delete('/:ingredient_id', ingredientController.deleteIngredientById);

module.exports = router;
