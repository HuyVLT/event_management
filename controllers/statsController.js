const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

const getStats = async (req, res) => {
    try {
        const [totalEvents, totalUsers, totalRegistrations, totalStudents] = await Promise.all([
            Event.countDocuments(),
            User.countDocuments(),
            Registration.countDocuments(),
            User.countDocuments({ role: 'student' })
        ]);

        res.json({
            totalEvents,
            totalUsers,
            totalRegistrations,
            totalStudents
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStats,
    getAllUsers
}; 