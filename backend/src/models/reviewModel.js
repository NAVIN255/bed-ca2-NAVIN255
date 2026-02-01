const db = require("../services/db");

///////////////////////////////////////////////////////
// Select all reviews
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const SQL = `
        SELECT
            review_id,
            review_amt,
            review_text,
            user_id,
            created_at
        FROM Reviews
        ORDER BY created_at DESC;
    `;
    db.query(SQL, callback);
};

///////////////////////////////////////////////////////
// Insert review
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQL = `
        INSERT INTO Reviews (review_amt, review_text, user_id)
        VALUES (?, ?, ?);
    `;
    const VALUES = [
        data.review_amt,
        data.review_text,
        data.user_id
    ];
    db.query(SQL, VALUES, callback);
};
