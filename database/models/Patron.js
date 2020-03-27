const mongoose = require('mongoose');
const StoreItem = require('./StoreItem');
const PatronSchema = new mongoose.Schema({
	userId: Number,
	gold: { type: Number, default: 0 },
	currencyBonus: { type: Number, default: 1 },
	defenseBonus: { type: Number, default: 1 },
	offenseBonus: { type: Number, default: 1 },
	earnAgain: { type: Number, default: 0 },
	enabled: { type: Boolean, default: true },
	inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', default: null }]
});
const Patron = mongoose.model('Patron', PatronSchema);

module.exports = Patron;