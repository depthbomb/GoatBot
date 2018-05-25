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
	const nsfwRole = message.member.guild.roles.find('name', 'NSFW').id;
	const blacklist = client.config.nsfwBlacklist;

	if (blacklist.includes(message.member.id)) return;

	if (message.member.roles.exists('name', 'NSFW')) {
		message.member.removeRole(nsfwRole, 'Via GoatBot!').then(() => {
			message.delete().then(msg => {
				msg.reply('Your access to the NSFW channels has been revoked.');
			});
		});
	} else {
		message.member.addRole(nsfwRole, 'Via GoatBot!').then(() => {
			message.delete().then(msg => {
				msg.reply('You have been given access to the NSFW channels. Have fun ( ͡° ͜ʖ ͡°)');
			});
		});
	}

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"r18"
	],
	permLevel: 0
};

exports.help = {
	name: "nsfw",
	category: "Server",
	description: "Gives or revokes access to the NSFW channels",
	usage: "nsfw",
	params: {},
	examples: [
		"nsfw"
	]
};