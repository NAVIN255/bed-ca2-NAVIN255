const db = require("../services/db");

///////////////////////////////////////////////////////
// Model: User login (check username + password hash)
///////////////////////////////////////////////////////
module.exports.login = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, password, skillpoints
        FROM User
        WHERE username = ? ;
    `;
    const VALUES = [data.username];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error login:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Register new user
///////////////////////////////////////////////////////
module.exports.register = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO User (email, username, password, skillpoints)
        VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.email, data.username, data.password, data.skillpoints];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error register:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Check if username or email exists
///////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id
        FROM User
        WHERE username = ? OR email = ?;
    `;
    const VALUES = [data.username, data.email];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error checkUsernameOrEmailExist:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Select all users
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, email, skillpoints
        FROM User;
    `;

    db.query(SQLSTATEMENT, (error, results) => {
        if (error) {
            console.error("Model Error selectAll:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Select user by ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, email, skillpoints
        FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [data.id];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error selectById:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Update user by ID
///////////////////////////////////////////////////////
module.exports.updateUserById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.skillpoints, data.user_id];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error updateUserById:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

module.exports.deleteUserById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM User
        WHERE user_id = ?;
    `;
    db.query(SQLSTATEMENT, [data.user_id], callback);
};