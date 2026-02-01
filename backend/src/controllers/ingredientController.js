const model = require("../models/ingredientModel");

///////////////////////////////////////////////////////
// Controller: Read all ingredients
///////////////////////////////////////////////////////
module.exports.readAllIngredients = (req, res, next) => {
    const callback = (error, results) => {
        if(error){
            console.error("Error readAllIngredients:", error);
            res.status(500).json(error);
            return;
        }
        console.log("Ingredients retrieved:", results.length);
        res.status(200).json(results);
    }
    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller: Read ingredient by ID
///////////////////////////////////////////////////////
module.exports.readIngredientById = (req, res, next) => {
    const data = { ingredient_id: req.params.ingredient_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error readIngredientById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.length === 0){
            res.status(404).json({ message: "Ingredient not found" });
            return;
        }
        console.log("Ingredient found:", results[0]);
        res.status(200).json(results[0]);
    }
    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Create a new ingredient
///////////////////////////////////////////////////////
module.exports.createIngredient = (req, res) => {
    const data = {
        class_id: req.body.class_id,
        name: req.body.name,
        magic_exp: req.body.magic_exp
    };

    model.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error createIngredient:", error);
            return res.status(500).json(error);
        }

        console.log("Ingredient created with ID:", results.insertId);

        res.status(201).json({
            message: "Ingredient created successfully",
            ingredient_id: results.insertId
        });
    });
};

///////////////////////////////////////////////////////
// Controller: Update ingredient
///////////////////////////////////////////////////////
module.exports.updateIngredientById = (req, res, next) => {
    const data = {
        ingredient_id: req.params.ingredient_id,
        class_id: req.body.class_id,
        name: req.body.name,
        magic_exp: req.body.magic_exp
    };
    const callback = (error, results) => {
        if(error){
            console.error("Error updateIngredientById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "Ingredient not found" });
            return;
        }
        console.log("Ingredient updated:", data);
        res.status(200).json({ message: "Ingredient updated successfully" });
    }
    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete ingredient
///////////////////////////////////////////////////////
module.exports.deleteIngredientById = (req, res, next) => {
    const data = { ingredient_id: req.params.ingredient_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error deleteIngredientById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "Ingredient not found" });
            return;
        }
        console.log("Ingredient deleted:", data.ingredient_id);
        res.status(204).send();
    }
    model.deleteById(data, callback);
};
