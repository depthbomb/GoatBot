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
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const userId = args[0];
	const guild = message.guild;
	await guild.fetchBan(userId)
	.then(({ user, reason }) => {
		guild.unban(user, `Requested by ${message.member.displayName}`)
		.then(() => {
			const embed = new RichEmbed().setTimestamp();
			embed.setAuthor(user.username, user.avatarURL)
				 .setColor(client.colors.green)
				 .setDescription(`${user.username} has been unbanned by ${message.member.displayName}.`);

			return message.channel.send({ embed });
		})
		.catch(err => client.msg(message, 'red', 'error', `Unable to lift ban: ${err}`));
	})
	.catch(async err => {
		TempBan.findOneAndRemove({ userId })
		.then(ban => {
			const embed = new RichEmbed().setTimestamp();
			if (ban) {
				embed.setColor(client.colors.green)
					 .setDescription(`Temp ban on user #${userId} has been lifted by ${message.member.displayName}.`);
			} else {
				embed.setColor(client.colors.red)
					 .setDescription(`User #${userId} has no temp bans.`);
			}

			return message.channel.send({ embed });
		})
		.catch(err => message.reply(err.message));
	});
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
		'user ID': 'ID of user to unban'
	},
	examples: [
		'unban 12345678910'
	]
};