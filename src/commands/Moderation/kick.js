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
	const mention = args[0];
	const reason = args.slice(1).join(' ') || 'No reason given';

	let member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.find(m => m.id === mention);
	}

	if (member) {
		const executor = message.member;
		member.kick(reason).then(() => {
			let embed = new RichEmbed()
				.setAuthor(member.displayName, member.user.avatarURL)
				.setColor(client.colors.red)
				.setDescription(`Kicked from the server by ${executor.displayName}.`)
				.addField('Reason', reason)
				.setTimestamp();

			message.channel.send({ embed }).then(() => {
				embed = new RichEmbed()
					  .setColor(client.colors.red)
					  .setDescription(`You have been kicked from the server by ${executor.displayName}.\nYou may rejoin the server but you should behave so you don't find yourself kicked again.`)
					  .addField('Reason', reason)
					  .setTimestamp();
				member.send({ embed }).catch(_ => {});
			});
		}).catch(err => client.msg(message, 'red', 'error', `Failed to kick ${member.displayName}, likely a permission error.`));

	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'kick',
		'boot',
		'yeet'
	],
	permLevel: 5
};

exports.help = {
	name: 'ban',
	category: 'Moderation',
	description: 'Kicks a user from the guild',
	usage: 'ban [@mention|user ID] [reason?]',
	params: {
		'@mention|user ID': 'Mention or ID of user to kick',
		'reason': 'Reason for kicking the user'
	},
	examples: [
		'kick @Username#0000 Bad'
	]
};