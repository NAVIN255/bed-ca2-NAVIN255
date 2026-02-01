const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

router.get('/', studentController.readTopStudents);
router.get('/user/:user_id', studentController.readStudentByUserId);
router.get('/:student_id', studentController.readStudentById);
router.post('/', studentController.createStudent);
router.put('/:student_id', studentController.updateStudentById);
router.delete('/:student_id', studentController.deleteStudentById);

// Bulk update magic_exp
router.put('/bulk/magic-exp', studentController.bulkUpdateMagicExp);

module.exports = router;
