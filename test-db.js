const mongoose = require('mongoose');
const Event = require('./models/eventModel');

async function testDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/event_management');
        console.log('Connected to MongoDB successfully!');
        
        console.log('Fetching events...');
        const events = await Event.find();
        console.log('Found events:', events.length);
        console.log('Events:', events);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
    }
}

testDB(); 