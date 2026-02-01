const pool = require("../services/db");

///////////////////////////////////////////////////////
// Select all classes
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const SQL = `
        SELECT 
            c.class_id,
            c.name,
            c.min_magic_exp,
            s.name AS required_spell,
            c.required_spell_id
        FROM Classes c
        JOIN SpellShop s
          ON c.required_spell_id = s.spell_id
        ORDER BY c.class_id ASC;
    `;
    pool.query(SQL, callback);
};


///////////////////////////////////////////////////////
// Select class by ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
    const SQL = `
        SELECT 
            c.class_id,
            c.name,
            c.min_magic_exp,
            s.name AS required_spell,
            c.required_spell_id
        FROM Classes c
        JOIN SpellShop s
          ON c.required_spell_id = s.spell_id
        WHERE c.class_id = ?;
    `;
    pool.query(SQL, [data.class_id], callback);
};

///////////////////////////////////////////////////////
// Insert a new class
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQL = `
        INSERT INTO Classes (name, required_spell_id, min_magic_exp)
        VALUES (?, ?, ?);
    `;
    pool.query(SQL, [
        data.name,
        data.required_spell_id,
        data.min_magic_exp
    ], callback);
};

///////////////////////////////////////////////////////
// Update class by ID
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) =>
{
    const SQLSTATEMENT = `
        UPDATE Classes
        SET 
            name = ?,
            required_spell_name = ?,
            required_spell_id = ?,
            min_magic_exp = ?
        WHERE class_id = ?;
    `;

    const VALUES = [
        data.name,
        data.required_spell_name,
        data.required_spell_id,
        data.min_magic_exp,
        data.class_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Delete class by ID
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM Classes
        WHERE class_id = ?;
    `;

    const VALUES = [data.class_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

///////////////////////////////////////////////////////
// Select classes a student is enrolled in
///////////////////////////////////////////////////////
module.exports.selectStudentEnrollments = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            ce.enrollment_id,
            ce.class_id,
            c.name AS class_name,
            ce.student_id,
            ce.time_enrolled
        FROM ClassEnrollment ce
        JOIN Classes c
            ON ce.class_id = c.class_id
        WHERE ce.student_id = ?
        ORDER BY ce.time_enrolled DESC;
    `;

    pool.query(SQLSTATEMENT, [data.student_id], callback);
};

///////////////////////////////////////////////////////
// Insert student enrollment into class
///////////////////////////////////////////////////////
module.exports.insertEnrollment = (data, callback) => {
    const SQL = `
        INSERT INTO ClassEnrollment (class_id, student_id)
        VALUES (?, ?);
    `;
    pool.query(SQL, [
        data.class_id,
        data.student_id
    ], callback);
};

///////////////////////////////////////////////////////
// Delete student enrollment by enrollment ID
///////////////////////////////////////////////////////
module.exports.deleteEnrollment = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM ClassEnrollment
        WHERE enrollment_id = ?;
    `;

    const VALUES = [data.enrollment_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
