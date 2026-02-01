const model = require("../models/completionModel");

///////////////////////////////////////////////////////
// Controller: Read all completions
///////////////////////////////////////////////////////
module.exports.readAllCompletions = (req, res, next) =>
{
    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error readAllCompletions:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller: Read completion by ID
///////////////////////////////////////////////////////
module.exports.readCompletionById = (req, res, next) =>
{
    const data = {
        complete_id: req.params.complete_id
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error readCompletionById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                message: "Completion not found"
            });
            return;
        }

        res.status(200).json(results);
    };

    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Create new completion
///////////////////////////////////////////////////////
module.exports.createCompletion = (req, res, next) =>
{
    if (req.body.review_amt === undefined || req.body.notes === undefined) {
        res.status(400).json({
            message: "Review amount or notes missing"
        });
        return;
    }

    const data = {
        challenge_id: req.body.challenge_id,
        user_id: req.body.user_id,
        completed: req.body.completed,
        review_amt: req.body.review_amt,
        notes: req.body.notes,
        creation_date: new Date()
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error createCompletion:", error);
            res.status(500).json(error);
            return;
        }

        res.status(201).json({
            message: "Completion created successfully",
            completion_id: results.insertId
        });
    };

    model.insertSingle(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Update completion notes or review
///////////////////////////////////////////////////////
module.exports.updateCompletion = (req, res, next) =>
{
    const data = {
        complete_id: req.body.complete_id,
        review_amt: req.body.review_amt,
        notes: req.body.notes
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error updateCompletion:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({
                message: "Completion not found"
            });
            return;
        }

        res.status(204).send();
    };

    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete completion
///////////////////////////////////////////////////////
module.exports.deleteCompletion = (req, res, next) =>
{
    const data = {
        complete_id: req.body.complete_id
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error deleteCompletion:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({
                message: "Completion not found"
            });
            return;
        }

        res.status(204).send();
    };

    model.deleteById(data, callback);
};
