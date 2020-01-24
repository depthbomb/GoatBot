/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2020 Caprine Logic - https://caprine.net
|
|	This library is free software; you can redistribute it and/or
|	modify it under the terms of the GNU Lesser General Public
|	License as published by the Free Software Foundation; either
|	version 2.1 of the License, or (at your option) any later version.
|
|	This library is distributed in the hope that it will be useful,
|	but WITHOUT ANY WARRANTY; without even the implied warranty of
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const StoreItem = require('@models/StoreItem');
const Patron = require('@models/Patron');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;
	const p = await Patron.findOne({ userId }, 'gold inventory').exec();

	const userGold = p.gold;
	const userInventory = p.inventory;

	StoreItem.find({ cost: { $lte: userGold }, _id: { $nin: userInventory } })
	.then(docs => {
		
	});
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'store',
	category: 'Goatconomy',
	description: 'Displays items for purchase in the store',
	usage: 'store',
	params: {},
	examples: []
};