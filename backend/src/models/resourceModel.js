const db = require("../services/db");
// Adjust path if your database connection file differs

///////////////////////////////////////////////////////
// Model: Select all resources belonging to a user
///////////////////////////////////////////////////////
module.exports.selectByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            ur.user_id,
            ur.resource_id,
            ur.name,
            ur.quantity
        FROM user_resources ur
        WHERE ur.user_id = ?
        ORDER BY ur.resource_id ASC;
    `;

    const VALUES = [data.user_id];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error selectByUserId:", error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Insert a single user resource
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO user_resources (
            resource_id,
            user_id,
            name,
            quantity
        ) VALUES (?, ?, ?, ?);
    `;

    const VALUES = [
        data.resource_id,
        data.user_id,
        data.name,
        data.quantity
    ];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error insertSingle:", error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};
