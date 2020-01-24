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
	const userId = message.author.id;
	const emoji  = client.emojis.find(e => e.name === 'caprineGold');
	Patron.findOne({ userId }, 'gold inventory')
	.populate('inventory')
	.then(patron => {
		if (patron) {
			const embed = new RichEmbed()
				  .setAuthor(`${message.member.displayName}'s Inventory`, message.author.avatarURL)
				  .addField('Goat Gold', emoji + ' ' + patron.gold);
			return message.channel.send({ embed });
		} else {
			return message.reply('You currently do not have an inventory.')
		}
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
	name: 'inventory',
	category: 'Goatconomy',
	description: 'View your inventory',
	usage: 'inventory',
	params: {},
	examples: [
		'inventory'
	]
};