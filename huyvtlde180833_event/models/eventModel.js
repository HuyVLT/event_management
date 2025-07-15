const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        min: 1
    },
    maxCapacity: {
        type: Number,
        min: 1
    },
    currentRegistrations: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual để đảm bảo tương thích
eventSchema.virtual('finalCapacity').get(function() {
    return this.maxCapacity || this.capacity;
});

// Đảm bảo virtual fields được include khi convert to JSON
eventSchema.set('toJSON', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 