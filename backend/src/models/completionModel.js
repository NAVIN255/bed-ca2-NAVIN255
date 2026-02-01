const pool = require("../services/db");

///////////////////////////////////////////////////////
// Select all completions
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) =>
{
    const SQLSTATEMENT = `
        SELECT 
            complete_id,
            challenge_id,
            user_id,
            completed,
            review_amt,
            creation_date,
            notes
        FROM UserCompletion
        ORDER BY creation_date DESC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

///////////////////////////////////////////////////////
// Select completion by completion ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT 
            complete_id,
            challenge_id,
            user_id,
            completed,
            review_amt,
            creation_date,
            notes
        FROM UserCompletion
        WHERE complete_id = ?;
    `;

    const VALUES = [data.complete_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Insert a new completion
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion
        (challenge_id, user_id, completed, review_amt, creation_date, notes)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    const VALUES = [
        data.challenge_id,
        data.user_id,
        data.completed,
        data.review_amt,
        data.creation_date,
        data.notes
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Update completion notes or review amount
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) =>
{
    const SQLSTATEMENT = `
        UPDATE UserCompletion
        SET 
            review_amt = ?,
            notes = ?
        WHERE complete_id = ?;
    `;

    const VALUES = [
        data.review_amt,
        data.notes,
        data.complete_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Delete completion by ID
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion
        WHERE complete_id = ?;
    `;

    const VALUES = [data.complete_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
