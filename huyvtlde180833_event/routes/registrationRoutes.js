const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isStudent, isAdminOrStudent } = require('../middleware/authMiddleware');
const {
    registerForEvent,
    unregisterFromEvent,
    getAllRegistrations,
    getRegistrationsByDate,
    getMyRegistrations
} = require('../controllers/registrationController');

// Student routes
router.post('/', verifyToken, isStudent, registerForEvent);
router.delete('/:registrationId', verifyToken, isAdminOrStudent, unregisterFromEvent);
router.get('/my', verifyToken, isStudent, getMyRegistrations);

// Admin routes
router.get('/list', verifyToken, isAdmin, getAllRegistrations);
router.get('/search', verifyToken, isAdmin, getRegistrationsByDate);

module.exports = router; 