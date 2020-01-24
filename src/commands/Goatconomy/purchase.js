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
	if (args.length === 0) return;
	const itemId = args.join(' ');
	const userId = message.author.id;
	const emoji  = client.emojis.find(e => e.name === 'caprineGold');
	const p = await Patron.findOne({ userId }, 'gold inventory').exec();

	const gold = p.gold;
	const inventory = p.inventory;

	StoreItem.findOne({ itemId })
	.then(item => {
		if (!item) return message.reply(`Item #\`${itemId}\` does not exist.`);
		if (inventory.includes(item._id)) return message.reply(`You already own **${item.name}**.`);
		if (item.cost > gold) return message.reply(`You do not have enough ${emoji} to purchase **${item.name}**.`);

		Patron.updateOne({ userId }, { $push: { inventory: item._id } })
		.then(res => {
			const embed = new RichEmbed()
				  .setColor(client.colors.green)
				  .setAuthor(message.member.displayName, message.author.avatarURL)
				  .setTitle('Purchase complete!')
				  .setDescription(`You have successfully purchased **${item.name}**!`);
			
			return message.channel.send({ embed });
		})
		.catch(err => message.reply(`**Error in purchase**: ${err.message}`));
	})
	.catch(err => message.reply(err.message));
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'purchase',
	category: 'Goatconomy',
	description: 'Purchases a store item by its ID',
	usage: 'purchase',
	params: {},
	examples: []
};