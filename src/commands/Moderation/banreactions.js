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

const ReactionBan = require('@models/ReactionBan');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
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
		const userId = member.id;
		const embed = new RichEmbed()
			  .setAuthor(message.member.displayName, message.author.avatarURL)
			  .setTimestamp();

		const ban = await ReactionBan.findOne({ userId }).exec();

		if (ban) {
			await ban.deleteOne().then(() => {
				embed.setColor(client.colors.orange)
					 .setDescription(`Reaction ban on ${member.displayName} has been lifted.`);
			})
			.catch(err => {
				embed.setColor(client.colors.red)
					 .setDescription(`**Error**: ${err.message}`);
			});
		} else {
			await ReactionBan.create({ userId, reason })
			.then(ban => {
				embed.setColor(client.colors.red)
					 .setDescription(`${member.displayName} has been banned from adding reactions.`)
					 .addField('Reason', ban.reason);
			});
		}

		return message.channel.send({ embed });
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [
		'banreact',
		'reactban',
		'reactionban',
	],
	permLevel: 5,
};

exports.help = {
	name: 'banreactions',
	category: 'Moderation',
	description: 'Bans/unbans a user from adding reactions to any message',
	usage: 'banreactions [@mention|user ID]',
	params: {
		'@mention|user ID': 'Mention or user ID'
	},
	examples: [
		'banreactions @Username#0000'
	]
};