const db = require("../services/db");

///////////////////////////////////////////////////////
// Select all user resources
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const SQL = `
        SELECT user_resource_id, resource_name, user_id, quantity
        FROM UserResources;
    `;
    db.query(SQL, callback);
};

///////////////////////////////////////////////////////
// Select resources by user ID
///////////////////////////////////////////////////////
module.exports.selectByUserId = (data, callback) => {
    const SQL = `
        SELECT user_resource_id, resource_name, quantity
        FROM UserResources
        WHERE user_id = ?;
    `;
    db.query(SQL, [data.user_id], callback);
};

///////////////////////////////////////////////////////
// Insert a new user resource
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQL = `
        INSERT INTO UserResources (resource_name, user_id, quantity)
        VALUES (?, ?, ?);
    `;
    const VALUES = [
        data.resource_name,
        data.user_id,
        data.quantity
    ];
    db.query(SQL, VALUES, callback);
};

///////////////////////////////////////////////////////
// Update user resource quantity
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) => {
    const SQL = `
        UPDATE UserResources
        SET quantity = ?
        WHERE user_resource_id = ?;
    `;
    db.query(SQL, [data.quantity, data.user_resource_id], callback);
};

///////////////////////////////////////////////////////
// Delete user resource
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) => {
    const SQL = `
        DELETE FROM UserResources
        WHERE user_resource_id = ?;
    `;
    db.query(SQL, [data.user_resource_id], callback);
};
