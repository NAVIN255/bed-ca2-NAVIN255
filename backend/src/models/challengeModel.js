const pool = require("../services/db");

///////////////////////////////////////////////////////
// Select all fitness challenges
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) =>
{
    const SQLSTATEMENT = `
        SELECT *
        FROM FitnessChallenge
        ORDER BY challenge_id ASC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

///////////////////////////////////////////////////////
// Select challenge by ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT *
        FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Read challenges created by a specific user
///////////////////////////////////////////////////////
module.exports.readUserChallenges = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT *
        FROM FitnessChallenge
        WHERE creator_id = ?
        ORDER BY challenge_id DESC;
    `;

    const VALUES = [data.creator_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Insert a new fitness challenge
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATEMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);
    `;

    const VALUES = [
        data.challenge,
        data.creator_id,
        data.skillpoints
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Get creator ID of a challenge
///////////////////////////////////////////////////////
module.exports.getChallengeCreatorId = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT creator_id
        FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Update challenge by ID
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) =>
{
    const SQLSTATEMENT = `
        UPDATE FitnessChallenge
        SET challenge = ?, skillpoints = ?
        WHERE challenge_id = ?;
    `;

    const VALUES = [
        data.challenge,
        data.skillpoints,
        data.challenge_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Delete challenge by ID
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Check if user & challenge exist
///////////////////////////////////////////////////////
module.exports.checkId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 1
        FROM User
        WHERE user_id = ?
        AND EXISTS (
            SELECT 1
            FROM FitnessChallenge
            WHERE challenge_id = ?
        );
    `;

    const VALUES = [
        data.user_id,
        data.challenge_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Insert challenge completion
///////////////////////////////////////////////////////
module.exports.insertCompletion = (data, callback) =>
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
// Read challenge & user skillpoints
///////////////////////////////////////////////////////
module.exports.selectSkillpoints = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT 
            c.skillpoints AS challenge_skillpoints,
            u.skillpoints AS current_skillpoints
        FROM FitnessChallenge c
        JOIN User u
        ON u.user_id = ?
        WHERE c.challenge_id = ?;
    `;

    const VALUES = [
        data.user_id,
        data.challenge_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Update user's skillpoints
///////////////////////////////////////////////////////
module.exports.updateUserSkillpoints = (data, callback) =>
{
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = ?
        WHERE user_id = ?;
    `;

    const VALUES = [
        data.totalPoints,
        data.user_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Read completion by completion ID
///////////////////////////////////////////////////////
module.exports.selectCompletionById = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT *
        FROM UserCompletion
        WHERE complete_id = ?;
    `;

    const VALUES = [data.completed_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Read completions by challenge ID
///////////////////////////////////////////////////////
module.exports.selectCompletionByChallengeId = (data, callback) =>
{
    const SQLSTATEMENT = `
        SELECT *
        FROM UserCompletion
        WHERE challenge_id = ?
        ORDER BY creation_date DESC;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
