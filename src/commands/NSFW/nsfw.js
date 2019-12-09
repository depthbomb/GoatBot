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

exports.run = (client, message, args, level) => {
	const nsfwRole = message.member.guild.roles.find(r => r.name === 'NSFW').id;
	const lenny = '( ͡° ͜ʖ ͡°)'; //	Store the face as its own variable because it messes up the text in the line it is in

	if (message.member.roles.find(r => r.name === 'NSFW')) {
		message.member.removeRole(nsfwRole, 'Via GoatBot!').then(() => {
			return message.reply('Your access to the NSFW channels has been revoked.');
		});
	} else {
		message.member.addRole(nsfwRole, 'Via GoatBot!').then(() => {
			return message.reply(`You have been given access to the NSFW channels. Have fun ${lenny}\n\n_Abuse of this command, such as using it frequently for no reason, will result in you being blacklisted from using it. If you do not wish to see the content in the channels, then don't bother joining._`);
		});
	}

};

exports.conf = {
	enabled: true,
	aliases: [
		"r18"
	],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "nsfw",
	category: "NSFW",
	description: "Gives or revokes access to the NSFW channels",
	usage: "nsfw",
	params: {},
	examples: [
		"nsfw"
	]
};