const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
	_id: { type: String, default: uuid() },
	userId: Number,
	arrival: Number,
	reminderMessage: String,
	createdAt: { type: Number, default: Math.floor(new Date() / 1000) }
});
const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = Reminder;