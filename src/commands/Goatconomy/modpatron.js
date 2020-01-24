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
exports.run = async (client, message, args, level) => {
	const mention = args[0];
	const action = args[1];
	const options = args.slice(2).join(' ');
	if (!action) return;

	let member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.find(m => m.id === mention);
	}

	if (member) {
		const userId = member.id;
		Patron.findOne({ userId }, (err, patron) => {
			if (err) return message.reply(err);
			if (!patron) return message.reply('User does not have an inventory yet.');
			switch (action) {
				case 'toggle':
					patron.enabled = !patron.enabled;
					patron.save((err, updatedPatron) => {
						if (updatedPatron.enabled) {
							return message.channel.send(`<@${userId}> is now eligible in interacting with the Goatconomy.`);
						} else {
							return message.channel.send(`<@${userId}> is now ineligible in interacting with the Goatconomy.`);
						}
					});
					break;
				case 'givegold':
					const goldAmount = parseInt(options);
					patron.gold = patron.gold + goldAmount;
					patron.save((err, updatedPatron) => {
						if (goldAmount < 0) {
							return message.channel.send(`<@${userId}> has had ${goldAmount} deducted from their balance.`);
						} else {
							return message.channel.send(`<@${userId}> has had ${goldAmount} added to their balance.`);
						}
					});
					break;
			}
		});
		
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: 'modpatron',
	category: 'Goatconomy',
	description: 'Modified a Goatconomy patron',
	usage: 'modpatron [user ID] [action]',
	params: {},
	examples: [
		'modpatron 1234567890 disable',
		'modpatron 1234567890 enable',
	]
};