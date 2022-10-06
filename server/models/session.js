const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionID: Number,
    location: String,
    timeframe: [{start: Number, end: Number}],
    topic: String,
    attendees: Number
});

module.exports = mongoose.model('Session', SessionSchema);