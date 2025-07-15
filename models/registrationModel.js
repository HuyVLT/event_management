const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration; 