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

const Patron = require('@models/Patron');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const itemId = args.join(' ');
	const userId = message.author.id;
	const p = await Patron.findOne({ userId }, 'inventory')
			  .populate('inventory')
			  .exec();
	const userInventory = p.inventory;
	const item = userInventory.find(i => i.itemId == itemId && i.canEquip === true);
	if (item) {
		return message.reply(`You have equipped **${item.name}**!`);
	} else {
		return message.reply('The item you requested does not exist or it cannot be equipped.');
	}
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'equip',
	category: 'Goatconomy',
	description: 'Equips a purchased equippable item in your inventory',
	usage: 'equip [itemId]',
	params: {
		'itemId': 'ID of item to equip'
	},
	examples: [
		'equip 1'
	]
};