const mongoose = require('mongoose');
const UnboxSchema = new mongoose.Schema({
	userId: Number,
	tiers: [{ type: Number }]
});
const Unbox = mongoose.model('Unbox', UnboxSchema);

module.exports = Unbox;