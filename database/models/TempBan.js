const mongoose = require('mongoose');
const TempBanSchema = new mongoose.Schema({
	userId: Number,
	reason: { type: String, default: 'No reason provided' },
	expires: Number
});
const TempBan = mongoose.model('TempBan', TempBanSchema);

module.exports = TempBan;