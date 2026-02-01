const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const jwtMiddleware = require("../middleware/authMiddleware");

// =====================================
// All class routes require authentication
// =====================================
router.use(jwtMiddleware.verifyToken);

// -------------------------
// CLASS ENROLLMENTS (PUT FIRST)
// -------------------------

// GET /api/classes/student/:student_id
router.get("/student/:student_id", classController.readStudentEnrollments);

// POST /api/classes/:class_id/enroll
router.post("/:class_id/enroll", classController.enrollStudent);

// DELETE /api/classes/enroll/:enrollment_id
router.delete("/enroll/:enrollment_id", classController.removeEnrollment);

// -------------------------
// CLASSES CRUD
// -------------------------

// GET /api/classes
router.get("/", classController.readAllClasses);

// POST /api/classes
router.post("/", classController.createClass);

// GET /api/classes/:class_id
router.get("/:class_id", classController.readClassById);

// PUT /api/classes/:class_id
router.put("/:class_id", classController.updateClassById);

// DELETE /api/classes/:class_id
router.delete("/:class_id", classController.deleteClassById);

module.exports = router;
