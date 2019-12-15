const mongoose = require('mongoose');
const ReactionBanSchema = new mongoose.Schema({
	userId: Number,
	reason: { type: String, default: 'No reason provided' }
});
const ReactionBan = mongoose.model('ReactionBan', ReactionBanSchema);

module.exports = ReactionBan;