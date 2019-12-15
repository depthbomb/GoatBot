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

const Warning = require('@models/Warning');
const moment = require('moment');
exports.run = async (client, message, args, level) => {
	if(args.length === 0) return;
	const mention = args[0];
	const reason = args.slice(1).join(' ') || 'No reason given';

	let member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.find(m => m.id === mention);
	}

	if (member) {
		const userId = member.id;
		const now = client.timestamp();
		const expires = moment().add(3, 'days').unix();

		const warnings = await Warning.find({ userId, expires: { $gt: now } });
		let warningCount = warnings.length;

		if (warningCount > 2) {
			Warning.deleteMany({ userId, expires: { $lte: now } }, err => {
				if (err) throw new Error(err);
			});
			return client.kennelUser(member, reason, user.displayName);
		}

		Warning.create({ userId, reason, expires })
		.then(doc => {
			warningCount++;
			const warningMessage = [
				`<@${userId}>, you have recieved warning \`${warningCount} / 3\`.`,
				`Reason: \`${reason}\``,
			].join('\n');
			if (warningCount === 3) warningMessage.push('Your next warning will result in punishment.');
	
			return message.channel.send(warningMessage);
		})
		.catch(err => message.reply(err.message));
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 4
};

exports.help = {
	name: 'warn',
	category: 'Moderation',
	description: 'Warns a user',
	usage: 'warn [@mention|user ID] [reason?]',
	params: {
		'@mention|user ID': 'Mention or ID of user to warn',
		'reason': '(Optional) Reason for the warning',
	},
	examples: [
		'warn @Username#0000',
		'warn @Username#0000 Don\'t do that!',
	]
};