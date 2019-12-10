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

const { RichEmbed } = require('discord.js');
exports.run = (client, message, args, level) => {
	if (args.length === 0) return;
	const userId = args[0];
	const guild = message.guild;
	const ban = guild.fetchBan(userId);
	const embed = new RichEmbed().setTimestamp();
	if (ban) {
		const bannedUser = ban.user;
		guild.unban(userId, `Requested by ${message.member.displayName}`).then(() => {
			embed
				.setAuthor(user.username, user.avatarURL)
				.setColor(client.colors.green)
				.setDescription(`${user.username} has been unbanned by ${message.member.displayName}.`);
		}).catch(err => client.msg(message, 'red', 'error', `Unable to lift ban: ${err}`));
	} else {
		const db = client.db.get('bans.user');
		if (db.filter({ userId }).value().length > 0) {
			db.remove({ userId }).write();
			embed
				.setColor(client.colors.green)
				.setDescription(`Temp ban on ${member.displayName} has been lifted by ${message.member.displayName}`);
		} else {
			embed
				.setColor(client.colors.red)
				.setDescription(`No user with ID \`${userId}\` has any active bans.`);
		}
	}

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 5
};

exports.help = {
	name: 'unban',
	category: 'Moderation',
	description: 'Removes server ban for user or removes their temp ban',
	usage: 'unban [user ID]',
	params: {
		'user ID': 'ID of user to ban'
	},
	examples: [
		'unban 12345678910'
	]
};