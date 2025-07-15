const User = require('../models/userModel');

const deleteStudent = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can be deleted' });
        }
        await user.deleteOne();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { deleteStudent }; 