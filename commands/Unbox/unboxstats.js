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

const Unbox = require('@models/Unbox');
const { MessageEmbed, Message } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;
	const tiers = client.config.unbox.tiers;
	const weights = client.config.unbox.weights;
	const msg = await message.reply('Loading...');
	Unbox.findOne({ userId }, (err, doc) => {
		if (err) return console.error(err);
		if (doc === null) {
			msg.delete();
			return message.reply('You currently have no stats recorded. Try unboxing something!');
		} else {
			const numUnboxed = doc.tiers.length;
			const tiersUnboxedBody = {
				Poor: 0,
				Common: 0,
				Uncommon: 0,
				Rare: 0,
				Epic: 0,
				Legendary: 0,
				Snow: 0,
				Aqua: 0,
				Fire: 0,
				Void: 0,
				Solar: 0,
				Nebular: 0,
				Omniscient: 0,
				Gay: 0,
				Corrupt: 0,
			};

			const tiersUnboxedMessage = [];

			// TODO: rewrite these, maybe
			for (let tier of doc.tiers) {
				const tierName = tiers[tier].name;
				tiersUnboxedBody[tierName] += 1;
			}
			for (let key of Object.keys(tiersUnboxedBody)) {
				if (tiersUnboxedBody[key] === 0) {
					delete tiersUnboxedBody[key];
				} else {
					tiersUnboxedMessage.push(`**${key}** - \`${tiersUnboxedBody[key]}\``);
				}
			}

			const embed = new MessageEmbed()
				  .setTitle(`${message.member.displayName}'s Unbox a Goat Stats`)
				  .setColor(client.colors.brand)
				  .setDescription(`<@${userId}> has unboxed **${numUnboxed}** goats so far.`)
				  .addField('Tiers Unboxed', tiersUnboxedMessage.join('\n'))
				  .setTimestamp();

			msg.edit(null, { embed });
		}
	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'unboxstats',
	category: 'Unbox',
	description: 'View your unboxing stats',
	usage: 'unboxstats',
	params: {},
	examples: [
		'unboxstats'
	]
};