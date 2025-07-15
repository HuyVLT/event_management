const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');

// Register for an event
const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const studentId = req.user._id;

        console.log(`Student ${studentId} đang đăng ký event ${eventId}`);

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            studentId,
            eventId
        });

        if (existingRegistration) {
            console.log('Student đã đăng ký event này rồi');
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Check if event exists and has capacity
        const event = await Event.findById(eventId);
        if (!event) {
            console.log('Event không tồn tại');
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check capacity
        const finalCapacity = event.maxCapacity || event.capacity;
        if (event.currentRegistrations >= finalCapacity) {
            console.log('Event đã đầy');
            return res.status(400).json({ message: 'Event is full' });
        }

        // Create new registration
        const registration = new Registration({
            studentId,
            eventId,
            registrationDate: new Date()
        });

        await registration.save();
        console.log('Đăng ký thành công');

        // Tăng currentRegistrations trong Event
        await Event.findByIdAndUpdate(
            eventId,
            { $inc: { currentRegistrations: 1 } }
        );
        console.log('Đã tăng currentRegistrations lên 1');

        res.status(201).json({ message: 'Registration successful', registration });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unregister from an event
const unregisterFromEvent = async (req, res) => {
    try {
        const { registrationId } = req.params;
        let registration;

        console.log(`Hủy đăng ký với ID: ${registrationId}`);

        if (req.user.role === 'admin') {
            // Admin có thể xóa bất kỳ đăng ký nào
            registration = await Registration.findById(registrationId);
        } else {
            // Student chỉ xóa đăng ký của mình
            registration = await Registration.findOne({
                _id: registrationId,
                studentId: req.user._id
            });
        }

        if (!registration) {
            console.log('Không tìm thấy đăng ký');
            return res.status(404).json({ message: 'Registration not found' });
        }

        const eventId = registration.eventId;
        
        await registration.deleteOne();
        console.log('Đã xóa đăng ký');

        // Giảm currentRegistrations trong Event
        await Event.findByIdAndUpdate(
            eventId,
            { $inc: { currentRegistrations: -1 } }
        );
        console.log('Đã giảm currentRegistrations xuống 1');

        res.json({ message: 'Unregistration successful' });
    } catch (error) {
        console.error('Lỗi khi hủy đăng ký:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all registrations (admin only)
const getAllRegistrations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const registrations = await Registration.find()
            .skip(skip)
            .limit(limit)
            .sort({ registrationDate: -1 });

        const total = await Registration.countDocuments();

        if (registrations.length === 0) {
            return res.json({ message: 'No registrations found' });
        }

        res.json({
            registrations,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRegistrations: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Search registrations by date range (admin only)
const getRegistrationsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({ message: 'Start date must be earlier than end date' });
        }

        // Kiểm tra nếu ngày bắt đầu và kết thúc bằng nhau
        if (start.getTime() === end.getTime()) {
            return res.status(400).json({ message: 'Start date and end date cannot be the same' });
        }

        const registrations = await Registration.find({
            registrationDate: {
                $gte: start,
                $lte: end
            }
        }).sort({ registrationDate: -1 });

        if (registrations.length === 0) {
            return res.json({ message: 'No registrations found in the specified date range' });
        }

        res.json({ registrations });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my registrations (student only)
const getMyRegistrations = async (req, res) => {
    try {
        console.log('Getting registrations for student:', req.user._id);
        
        const registrations = await Registration.find({
            studentId: req.user._id
        }).sort({ registrationDate: -1 });

        console.log('Found registrations:', registrations.length);

        res.json({
            registrations,
            totalRegistrations: registrations.length
        });
    } catch (error) {
        console.error('Error getting my registrations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerForEvent,
    unregisterFromEvent,
    getAllRegistrations,
    getRegistrationsByDate,
    getMyRegistrations
}; 