const db = require("../services/db"); 
// Adjust path if your db connection file is elsewhere

///////////////////////////////////////////////////////
// Model: Select all ingredients
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT 
            ingredient_id,
            class_id,
            name,
            magic_exp
        FROM ingredients
        ORDER BY ingredient_id ASC;
    `;

    db.query(SQLSTATEMENT, [], (error, results) => {
        if (error) {
            console.error("Model Error selectAll:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Select ingredient by ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            ingredient_id,
            class_id,
            name,
            magic_exp
        FROM ingredients
        WHERE ingredient_id = ?;
    `;

    const VALUES = [data.ingredient_id];

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
// Model: Insert a single ingredient
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO ingredients (
            class_id,
            name,
            magic_exp
        ) VALUES (?, ?, ?);
    `;

    const VALUES = [
        data.class_id,
        data.name,
        data.magic_exp
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

///////////////////////////////////////////////////////
// Model: Update ingredient by ID
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE ingredients
        SET 
            class_id = ?,
            name = ?,
            magic_exp = ?
        WHERE ingredient_id = ?;
    `;

    const VALUES = [
        data.class_id,
        data.name,
        data.magic_exp,
        data.ingredient_id
    ];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error updateById:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Delete ingredient by ID
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM ingredients
        WHERE ingredient_id = ?;
    `;

    const VALUES = [data.ingredient_id];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error deleteById:", error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};
