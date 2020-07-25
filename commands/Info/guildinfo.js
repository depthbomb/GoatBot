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

const moment = require('moment');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args, level) => {
	const guild = message.member.guild;
	const embed = new MessageEmbed()
		.setColor(client.colors.default)
		.setAuthor(`${guild.name} (${guild.nameAcronym})`, guild.iconURL({ dynamic: true }))
		.setDescription(`\`\`\`asciidoc\n
* Owner: ${guild.owner.displayName}
* Created: ${moment(guild.createdTimestamp).fromNow()}
** Creation: ${guild.createdAt}
* Members: ${guild.memberCount}
* Channels: ${guild.channels.cache.size}
* Emoji: ${guild.emojis.cache.size}
* Region: ${guild.region}
\`\`\``)
		.setTimestamp();
	
	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'guild',
		'gs'
	],
	permLevel: 0,
};

exports.help = {
	name: 'guildinfo',
	category: 'Info',
	description: 'Info about the current guild',
	usage: 'guildinfo',
	examples: [
		'guildinfo'
	]
};