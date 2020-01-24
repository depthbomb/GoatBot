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
			if (!patron) return message.reply('That user does not have an inventory yet.');
			
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
	name: 'rob',
	category: 'Goatconomy',
	description: 'Attempt to rob another user of some of their gold',
	usage: 'rob [user ID]',
	params: {},
	examples: [
		'rob 1234567890 disable'
	]
};