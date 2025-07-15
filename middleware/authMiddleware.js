const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = async (req, res, next) => {
    try {
        console.log('\n=== AUTH DEBUG ===');
        console.log('Headers:', req.headers);
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        
        if (!authHeader) {
            console.log('ERROR: No authorization header');
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);
        
        if (!token) {
            console.log('ERROR: No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.userId);
        console.log('Found user:', user);

        if (!user) {
            console.log('ERROR: User not found');
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        console.log('AUTH SUCCESS: User authenticated:', user.username, 'Role:', user.role);
        console.log('================\n');
        next();
    } catch (error) {
        console.error('AUTH ERROR:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    console.log('\n=== ADMIN CHECK ===');
    console.log('User role:', req.user?.role);
    console.log('User object:', req.user);
    
    if (req.user.role !== 'admin') {
        console.log('ERROR: Access denied - not admin');
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    console.log('ADMIN CHECK PASSED');
    console.log('==================\n');
    next();
};

const isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Student role required.' });
    }
    next();
};

const isAdminOrStudent = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Admin or Student role required.' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isStudent,
    isAdminOrStudent
}; 