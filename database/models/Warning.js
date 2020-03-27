const mongoose = require('mongoose');
const WarningSchema = new mongoose.Schema({
	userId: Number,
	reason: { type: String, default: 'No reason provided' },
	expires: Number
});
const Warning = mongoose.model('Warning', WarningSchema);

module.exports = Warning;