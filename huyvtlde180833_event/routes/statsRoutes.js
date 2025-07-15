const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { getStats, getAllUsers } = require('../controllers/statsController');

router.get('/', verifyToken, isAdmin, getStats);
router.get('/users', verifyToken, isAdmin, getAllUsers);

module.exports = router; 