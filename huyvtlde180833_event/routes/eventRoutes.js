const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin only routes
router.post('/', verifyToken, isAdmin, createEvent);
router.put('/:id', verifyToken, isAdmin, updateEvent);
router.delete('/:id', verifyToken, isAdmin, deleteEvent);

module.exports = router; 