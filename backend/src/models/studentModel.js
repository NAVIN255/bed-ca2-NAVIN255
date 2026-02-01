const db = require("../services/db");

///////////////////////////////////////////////////////
// Model: Insert new student
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO students (
            user_id,
            name,
            magic_exp
        ) VALUES (?, ?, ?);
    `;

    const VALUES = [
        data.user_id,
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
// Model: Select student by student_id
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT
            student_id,
            user_id,
            name,
            magic_exp
        FROM students
        WHERE student_id = ?;
    `;

    const VALUES = [data.student_id];

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
// Model: Select students by user_id
///////////////////////////////////////////////////////
module.exports.selectByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT
            student_id,
            user_id,
            name,
            magic_exp
        FROM students
        WHERE user_id = ?
        ORDER BY student_id ASC;
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
// Model: Update student by ID
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE students
        SET
            name = ?,
            magic_exp = ?
        WHERE student_id = ?;
    `;

    const VALUES = [
        data.name,
        data.magic_exp,
        data.student_id
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
// Model: Delete student by ID
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM students
        WHERE student_id = ?;
    `;

    const VALUES = [data.student_id];

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error deleteById:", error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Select top students by magic_exp
///////////////////////////////////////////////////////
module.exports.selectTopStudents = (callback) => {
    const SQLSTATEMENT = `
        SELECT
            student_id,
            user_id,
            name,
            magic_exp
        FROM students
        ORDER BY magic_exp DESC
        LIMIT 10;
    `;

    db.query(SQLSTATEMENT, (error, results) => {
        if (error) {
            console.error("Model Error selectTopStudents:", error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};

///////////////////////////////////////////////////////
// Model: Bulk update magic_exp
///////////////////////////////////////////////////////
module.exports.bulkUpdateMagicExp = (students, callback) => {
    if (!Array.isArray(students) || students.length === 0) {
        callback(null, { affectedRows: 0 });
        return;
    }

    const SQLSTATEMENT = `
        UPDATE students
        SET magic_exp = CASE student_id
            ${students.map(() => "WHEN ? THEN ?").join(" ")}
        END
        WHERE student_id IN (${students.map(() => "?").join(",")});
    `;

    const VALUES = [];

    students.forEach(student => {
        VALUES.push(student.student_id, student.magic_exp);
    });

    students.forEach(student => {
        VALUES.push(student.student_id);
    });

    db.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Model Error bulkUpdateMagicExp:", error);
            callback(error, null);
            return;
        }

        callback(null, results);
    });
};
