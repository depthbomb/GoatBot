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

exports.run = async (client, message, args, level) => {
	const { MessageEmbed } = require('discord.js');
	const moment = require('moment');
	let mention,
		member;

	if (args.length > 0) {
		mention = args.join(' ');
		if (mention.match(/<@!?\d{17,19}>/g)) {
			member = message.mentions.members.first();
		} else {
			member = message.guild.members.cache.find(m => m.id === mention);
		}
	} else {
		member = message.member;
	}

	if (member) {
		const user = member.user;
		const embed = new MessageEmbed()
			  .setAuthor(user.tag + ` (${user.id})`, user.avatarURL({ dynamic: true }))
			  .setColor(member.displayHexColor)
			  .addField('Account created', `${moment(user.createdAt).fromNow()}\n(${user.createdAt})`)
			  .addField('Joined guild', `${moment(member.joinedAt).fromNow()}\n(${member.joinedAt})`)
			  .addField('Is a bot?', user.bot, true)
			  .addField('Guild owner?', user.id === message.guild.ownerID, true)
			  .addField('Status', user.presence.status, true);

			if (member.lastMessage && user !== message.author) {
				const lastMessage = member.lastMessage;
				const msgCreatedAt = lastMessage.createdAt;
				const msgContent = lastMessage.cleanContent;
				embed.addField('Last Message', `\`${msgContent}\`\nSent ${moment(msgCreatedAt).fromNow()}`);
			}

		return message.reply({ embed });
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'ui',
		'uinfo',
		'userstats'
	],
	permLevel: 0,
};

exports.help = {
	name: 'userinfo',
	category: 'Info',
	description: 'Retrieves info on a user',
	usage: 'userinfo [@mention?|user ID?]',
	params: {
		'@mention|user ID': '(Optional) Mention or user ID to retrieve the info on, otherwise you will be chosen'
	},
	examples: [
		'userinfo',
		'userinfo @Username#0000'
	]
};