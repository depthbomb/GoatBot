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

const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
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
		const defaultAvatarUrl = member.user.defaultAvatarURL;
		const displayAvatarUrl = member.user.displayAvatarURL({ dynamic: true, size: 1024 });
		const avatar           = member.user.avatar;

		const urls = [
			`[Avatar](${displayAvatarUrl})`,
			`[Default Avatar](${defaultAvatarUrl})`
		].join('\n');

		const embed = new MessageEmbed()
			  .setTitle(`${member.displayName}'s avatars`)
			  .setDescription(`Avatar ID: \`${avatar}\``)
			  .setColor(client.colors.blue)
			  .setImage(displayAvatarUrl)
			  .setThumbnail(defaultAvatarUrl)
			  .addField('URLs', urls);

		return message.reply({ embed });
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'pfp',
		'ava',
		'profilepicture'
	],
	permLevel: 0,
};

exports.help = {
	name: 'avatar',
	category: 'Info',
	description: 'Retrieves info on a user\'s Discord avatar',
	usage: 'avatar [@mention?|user ID?]',
	params: {
		'@mention|user ID': '(Optional) Mention or user ID to retrieve the info on, otherwise you will be chosen'
	},
	examples: [
		'avatar',
		'avatar @Username#0000'
	]
};