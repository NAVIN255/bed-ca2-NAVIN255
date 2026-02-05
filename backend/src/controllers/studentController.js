const model = require("../models/studentModel");

///////////////////////////////////////////////////////
// Controller: Create a new student
///////////////////////////////////////////////////////
module.exports.createStudent = (req, res, next) =>
{
    console.log("Creating student:", req.body);
    const data = {
        user_id: req.body.user_id,
        name: req.body.name,
        magic_exp: 0
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error createStudent:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Student created with ID:", results.insertId);
        res.status(201).json({
            message: "Student created",
            student_id: results.insertId
        });
    };

    model.insertSingle(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Read student by ID
///////////////////////////////////////////////////////
module.exports.readStudentById = (req, res, next) =>
{
    const data = { student_id: req.params.student_id };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readStudentById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        console.log("Student found:", results[0]);
        res.status(200).json(results[0]);
    };

    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Read student by user
///////////////////////////////////////////////////////
module.exports.readStudentByUserId = (req, res, next) =>
{
    const data = { user_id: req.params.user_id };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readStudentByUserId:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Students found for user:", results.length);
        res.status(200).json(results);
    };

    model.selectByUserId(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Update student name or magic exp
///////////////////////////////////////////////////////
module.exports.updateStudentById = (req, res, next) =>
{
    const data = {
        student_id: req.params.student_id,
        name: req.body.name,
        magic_exp: req.body.magic_exp
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error updateStudentById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        console.log("Student updated:", data);
        res.status(200).json({ message: "Student updated successfully" });
    };

    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete student by ID
///////////////////////////////////////////////////////
module.exports.deleteStudentById = (req, res, next) =>
{
    const data = { student_id: req.params.student_id };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error deleteStudentById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        console.log("Student deleted:", data.student_id);
        res.status(204).send();
    };

    model.deleteById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Read top students by magic_exp
///////////////////////////////////////////////////////
module.exports.readTopStudents = (req, res, next) =>
{
    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readTopStudents:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Top students retrieved:", results.length);
        res.status(200).json(results);
    };

    model.selectTopStudents(callback);
};

///////////////////////////////////////////////////////
// Controller: Bulk update magic_exp
///////////////////////////////////////////////////////
module.exports.bulkUpdateMagicExp = (req, res, next) =>
{
    const data = req.body.students; // [{student_id, magic_exp}, ...]

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error bulkUpdateMagicExp:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Bulk magic_exp updated for students");
        res.status(200).json({ message: "Bulk magic_exp updated successfully" });
    };

    model.bulkUpdateMagicExp(data, callback);
};


module.exports.activateSpell = (req, res) => {
  const userId = res.locals.userId;
  const { spell_id } = req.body;

  if (!spell_id) {
    return res.status(400).json({ message: "spell_id required" });
  }

  const sql = `
    UPDATE User
    SET active_spell_id = ?
    WHERE user_id = ?;
  `;

  require("../services/db").query(sql, [spell_id, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      message: "Spell activated"
    });
  });
};
