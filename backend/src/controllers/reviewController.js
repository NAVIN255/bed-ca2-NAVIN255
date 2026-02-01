const model = require("../models/reviewModel");

///////////////////////////////////////////////////////
// Read all reviews
///////////////////////////////////////////////////////
module.exports.readAllReviews = (req, res) => {
    model.selectAll((error, results) => {
        if (error) {
            console.error("Error readAllReviews:", error);
            return res.status(500).json(error);
        }
        res.status(200).json(results);
    });
};

///////////////////////////////////////////////////////
// Create review
///////////////////////////////////////////////////////
module.exports.createReview = (req, res) => {
    if (!req.body.review_amt || !req.body.review_text) {
        return res.status(400).json({
            message: "Review amount or text missing"
        });
    }

    const data = {
        review_amt: req.body.review_amt,
        review_text: req.body.review_text,
        user_id: res.locals.userId // ✅ JWT
    };

    model.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error createReview:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Review created successfully",
            review_id: results.insertId
        });
    });
};
