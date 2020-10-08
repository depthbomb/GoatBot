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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const { MessageEmbed } = require('discord.js');
const { MissingArgumentError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length >= 1, 'Please provide a target.');
	const mention = args[0];
	const reason = args.slice(1).join(' ') || 'No reason given';

	let member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.cache.find(m => m.id == mention);
	}

	if (member) {
		member.ban({ days: 7, reason }).then(() => {
			let embed = new MessageEmbed()
				.setAuthor(member.displayName, member.user.avatarURL({ dynamic: true }))
				.setColor(client.colors.red)
				.setDescription(`${member.displayName} has been banned.`)
				.addField('Reason', reason)
				.setTimestamp();

			message.channel.send({ embed }).then(() => {
				embed = new MessageEmbed()
					  .setColor(client.colors.red)
					  .setDescription(`You have been banned permanently from the server by ${message.member.displayName}.\nAs this is a permanent ban (which are rare) it is unlikely that you will be able to appeal it. This is not to say that you _will_ remain banned permanently.`)
					  .addField('Reason', reason)
					  .setTimestamp();
				member.send({ embed }).catch(() => {});
			});
		}).catch(err => client.msg(message, 'red', 'error', `Failed to ban ${member.displayName}, likely a permission error.`));
	} else {
		message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: 'ban',
	category: 'Moderation',
	description: 'Permanently bans a user from the guild',
	usage: 'ban [@mention|user ID]',
	params: {
		'@mention|user ID': 'Mention or ID of user to ban'
	},
	examples: [
		'ban @Username#0000 Bad'
	]
};