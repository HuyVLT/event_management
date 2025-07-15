const Event = require('../models/eventModel');

// Create a new event
const createEvent = async (req, res) => {
    try {
        console.log('Creating event with data:', req.body);
        console.log('User creating event:', req.user);
        
        // Validation
        const { name, description, location, date, endDate, maxCapacity } = req.body;
        
        if (!name || !description || !location || !date) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: name, description, location, date' });
        }
        
        if (!maxCapacity || maxCapacity <= 0) {
            return res.status(400).json({ message: 'maxCapacity phải là số dương' });
        }
        
        // Validate date range if endDate is provided
        if (endDate && new Date(endDate) <= new Date(date)) {
            return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
        }
        
        // Create event with both maxCapacity and capacity for compatibility
        const eventData = {
            name,
            description,
            location,
            date: new Date(date),
            maxCapacity: parseInt(maxCapacity),
            capacity: parseInt(maxCapacity), // For backward compatibility
            currentRegistrations: 0
        };
        
        // Add endDate if provided
        if (endDate) {
            eventData.endDate = new Date(endDate);
        }
        
        console.log('Processed event data:', eventData);
        
        const event = new Event(eventData);
        await event.save();
        console.log('Event created successfully:', event);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error: ' + errors.join(', ') });
        }
        res.status(400).json({ message: error.message });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        console.log('Found events:', events.length);
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Validate date range if endDate is being updated
        if (req.body.endDate && req.body.date && new Date(req.body.endDate) <= new Date(req.body.date)) {
            return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
        }
        
        // Handle endDate update
        if (req.body.endDate !== undefined) {
            if (req.body.endDate === null || req.body.endDate === '') {
                event.endDate = undefined;
            } else {
                event.endDate = new Date(req.body.endDate);
            }
        }

        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
}; 