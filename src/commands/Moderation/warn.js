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

const moment = require('moment');
exports.run = (client, message, args, level) => {
	if(args.length === 0) return;
	const db = client.db.warnings.get('warnings');
	const mention = args[0];
	const reason = args.slice(1).join(' ') || 'No reason given';

	if (mention.match(/<@!?\d{17,19}>/g)) {
		user = message.mentions.members.first();
	} else {
		user = message.guild.members.find(m => m.id === mention);
	}

	if (user) {
		const expiration = moment().add(3, 'days').unix();
		let warnings = db.filter({ userId: user.id }).value().length;

		if (warnings > 2) {
			db.remove({ userId: user.id }).write();
			return client.kennelUser(user, reason, user.displayName);
		}

		db.push({ userId: user.id, reason: reason, expires: expiration }).write();
		//	Get updated number of warnings
		warnings = db.filter({ userId: user.id }).value().length;

		const warningMessage = [
			`<@${user.id}>, you have recieved warning \`${warnings} / 3\`.`,
			`Reason: \`${reason}\``,
		].join('\n');
		if (warnings === 3) warningMessage.push('Your next warning will result in punishment.');

		return message.channel.send(warningMessage);
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