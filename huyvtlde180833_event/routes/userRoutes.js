const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { deleteStudent } = require('../controllers/userController');

router.delete('/:id', verifyToken, isAdmin, deleteStudent);

module.exports = router; 