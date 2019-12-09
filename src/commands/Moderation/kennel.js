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

exports.run = async (client, message, args, level) => {
	if (args.length < 1) return;
	const mention = args[0];
	const reason = args.length > 1 ? args.slice(1).join(' ') : '*No reason given.*';
	
	let user;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		user = message.mentions.members.first();
	} else {
		return message.reply('Could not find user.');
	}

	return client.kennelUser(message, user, reason, message.member.displayName);
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [
		'ken',
		'lock'
	],
	permLevel: 5,
};

exports.help = {
	name: 'kennel',
	category: 'Moderation',
	description: 'Places a user in the kennel.',
	usage: 'kennel [@user] [reason?]',
	params: {
		'@user': 'Mention of user to kennel',
		'reason': '(Optional) Reason that the user gets kenneled.'
	},
	examples: [
		'kennel @Username#0000',
		'kennel @Username#0001 Being a bad boy'
	]
};