const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getProfile } = require('../controllers/authController');
const userController = require('../controllers/userController');
const reportController = require('../controllers/reportController');
const evaluationController = require('../controllers/evaluationController');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', auth, getProfile);

// User routes
router.get('/users', auth, userController.getUsers);
router.get('/users/:id', auth, userController.getUserById);
router.put('/users/:id', auth, userController.updateUser);
router.delete('/users/:id', auth, userController.deleteUser);

// Profile routes
router.get('/profile/student', auth, userController.getStudentProfile);
router.put('/profile/student', auth, userController.updateStudentProfile);
router.put('/profile/student/avatar', auth, userController.updateStudentAvatar);

// Progress routes
router.get('/progress/:studentId', auth, userController.getStudentProgress);

// Report routes
router.post('/reports', auth, reportController.submitReport);
router.get('/reports/student', auth, reportController.getStudentReports);
router.get('/reports/:id/feedback', auth, reportController.getReportFeedback);
router.post('/reports/preliminary', auth, reportController.submitPreliminaryReport);
router.get('/reports/preliminary/:id/status', auth, reportController.getPreliminaryReportStatus);
router.get('/reports/preliminary/:id/feedback', auth, reportController.getPreliminaryReportFeedback);
router.put('/reports/preliminary/:id', auth, reportController.updatePreliminaryReport);

// Evaluation routes
router.get('/evaluations/student', auth, evaluationController.getStudentEvaluations);
router.post('/evaluations', auth, evaluationController.submitEvaluation);
router.get('/evaluations/mentor', auth, evaluationController.getMentorEvaluations);
router.get('/evaluations/:id', auth, evaluationController.getEvaluationDetails);
router.get('/evaluations/teacher', auth, evaluationController.getTeacherEvaluations);
router.get('/evaluations/teacher/:id', auth, evaluationController.getTeacherEvaluationDetails);

// Only include routes that have corresponding controller functions
// Comment out or remove routes that don't have controllers yet

module.exports = router; 