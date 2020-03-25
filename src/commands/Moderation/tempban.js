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

const TempBan = require('@models/TempBan');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args, level) => {
	if (args.length === 0) return;
	const mention  = args[0];
	const duration = args[1].parseTimeFormat();
	const reason   = args.slice(2).join(' ') || 'No reason given';

	if (duration) {
		let member;
		if (mention.match(/<@!?\d{17,19}>/g)) {
			member = message.mentions.members.first();
		} else {
			member = message.guild.members.cache.find(m => m.id === mention);
		}

		if (member) {
			const userId = member.id;
			const expires = duration;	//	semantics
			member.kick(reason).then(() => {
				TempBan.create({ userId, reason, expires }, (err, ban) => {
					const expiresFormat = moment.unix(expires).format('dddd, MMMM Do YYYY, HH:mm:ss');
					const embed = new MessageEmbed()
						  .setColor(client.colors.red)
						  .setDescription(`${member.displayName} has been temporarily banned.`)
						  .addField('Reason', reason)
						  .addField('Expires', expiresFormat);
					
					const memberMessage = [
						`You have been temporarily banned by ${message.member.displayName} until ${expiresFormat}.`,
						`Reason:`,
						`\`\`\`md\n* ${reason}\`\`\``,
						'You will not be allowed back into the server until the ban expires or is lifted by staff.'
					];
					member.user.send(memberMessage.join('\n')).catch(() => {});
				});
			})
			.catch(() => client.msg(message, 'red', 'error', `Failed to kick ${member.displayName}, likely a permission error.`));
		} else {
			return message.reply('Could not find member.');
		}
	} else {
		return message.reply('Time format is invalid.');
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'tban',
		'bantemp'
	],
	permLevel: 3
};

exports.help = {
	name: 'tempban',
	category: 'Moderation',
	description: 'Temporarily bans a user, rejoining will result in them being kicked until the ban expires',
	usage: 'tempban [time] [@mention|user ID] [reason?]',
	params: {
		'time': 'Time format',
		'@mention|user ID': 'Mention or ID of user to temp ban',
		'reason?': '(Optional) Reason for the temp ban',
	},
	examples: [
		'tempban 1w @Username#0000 Bad'
	]
};