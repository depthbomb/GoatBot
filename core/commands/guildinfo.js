/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
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

exports.run = (client, message, args, level) => {
	const { RichEmbed } = require("discord.js");
	const moment = require("moment");
	const guild = message.member.guild;
	
	const embed = new RichEmbed()
		.setColor(client.colors.default)
		.setAuthor(`${guild.name} (${guild.nameAcronym})`, guild.iconURL)
		.setDescription(`\`\`\`asciidoc\n
* Owner: ${guild.owner.displayName}
* Created: ${moment(guild.createdTimestamp).fromNow()}
** Creation: ${guild.createdAt}
* Members: ${guild.memberCount}
* Channels: ${guild.channels.size}
* Emoji: ${guild.emojis.size}
* Region: ${guild.region}
\`\`\``)
		.setTimestamp();
	
	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		'guild',
		'gs'
	],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "guildinfo",
	category: "Info",
	description: "Info about the current guild",
	usage: "guildinfo",
	examples: [
		"guildinfo"
	]
};