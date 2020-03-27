const mongoose = require('mongoose');
const StoreItemSchema = new mongoose.Schema({
	itemId: Number,
	name: { type: String, required: true },
	description: { type: String, default: null },
	cost: { type: Number, required: true },
	type: { type: String, enum: ['Role', 'Stat'], required: true },
	currencyBonus: { type: Number, default: 0 },
	defenseBonus: { type: Number, default: 0 },
	role: { type: Number, default: 0 },
	canEquip: { type: Boolean, default: false }
});
const StoreItem = mongoose.model('StoreItem', StoreItemSchema);

module.exports = StoreItem;