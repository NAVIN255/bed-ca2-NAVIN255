const model = require("../models/classModel");

///////////////////////////////////////////////////////
// Controller: Read all classes
///////////////////////////////////////////////////////
module.exports.readAllClasses = (req, res, next) => {
    const callback = (error, results) => {
        if(error){
            console.error("Error readAllClasses:", error);
            res.status(500).json(error);
            return;
        }
        console.log("Classes retrieved:", results.length);
        res.status(200).json(results);
    }
    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller: Read class by ID
///////////////////////////////////////////////////////
module.exports.readClassById = (req, res, next) => {
    const data = { class_id: req.params.class_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error readClassById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.length === 0){
            res.status(404).json({ message: "Class not found" });
            return;
        }
        console.log("Class found:", results[0]);
        res.status(200).json(results[0]);
    }
    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Create a new class
///////////////////////////////////////////////////////
module.exports.createClass = (req, res, next) => {
    if (!req.body.name || !req.body.required_spell_id || req.body.min_magic_exp === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = {
        name: req.body.name,
        required_spell_id: req.body.required_spell_id,
        min_magic_exp: req.body.min_magic_exp
    };

    model.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error createClass:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            class_id: results.insertId,
            name: data.name,
            required_spell_id: data.required_spell_id,
            min_magic_exp: data.min_magic_exp
        });
    });
};

///////////////////////////////////////////////////////
// Controller: Update a class by ID
///////////////////////////////////////////////////////
module.exports.updateClassById = (req, res, next) => {
    const data = {
        class_id: req.params.class_id,
        name: req.body.name,
        required_spell_name: req.body.required_spell_name,
        required_spell_id: req.body.required_spell_id,
        min_magic_exp: req.body.min_magic_exp
    };
    const callback = (error, results) => {
        if(error){
            console.error("Error updateClassById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "Class not found" });
            return;
        }
        console.log("Class updated:", data);
        res.status(200).json({ message: "Class updated successfully" });
    }
    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete a class by ID
///////////////////////////////////////////////////////
module.exports.deleteClassById = (req, res, next) => {
    const data = { class_id: req.params.class_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error deleteClassById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "Class not found" });
            return;
        }
        console.log("Class deleted:", data.class_id);
        res.status(204).send();
    }
    model.deleteById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Read classes a student is enrolled in
///////////////////////////////////////////////////////
module.exports.readStudentEnrollments = (req, res, next) => {
    const data = { student_id: req.params.student_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error readStudentEnrollments:", error);
            res.status(500).json(error);
            return;
        }
        console.log(`Student ${data.student_id} enrolled in ${results.length} classes`);
        res.status(200).json(results);
    }
    model.selectStudentEnrollments(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Enroll student in class
///////////////////////////////////////////////////////
module.exports.enrollStudent = (req, res) => {
    const data = {
        class_id: req.params.class_id,
        student_id: req.body.student_id
    };

    if (!data.student_id) {
        return res.status(400).json({ message: "student_id is required" });
    }

    model.insertEnrollment(data, (error, results) => {
        if (error) {
            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(404).json({
                    message: "Student or class does not exist"
                });
            }
            return res.status(500).json(error);
        }

        res.status(201).json({ message: "Enrollment successful" });
    });
};


///////////////////////////////////////////////////////
// Controller: Remove student from class
///////////////////////////////////////////////////////
module.exports.removeEnrollment = (req, res, next) => {
    const data = { enrollment_id: req.params.enrollment_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error removeEnrollment:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "Enrollment not found" });
            return;
        }
        console.log(`Enrollment ${data.enrollment_id} deleted`);
        res.status(204).send();
    }
    model.deleteEnrollment(data, callback);
};
