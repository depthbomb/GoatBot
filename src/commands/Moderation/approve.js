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

exports.run = async (client, message, args, level) => {
	if (args.length < 1) return;
	const mention = args[0];
	
	let user;

	if (mention.match(/<@!?\d{17,19}>/g)) {
		user = message.mentions.members.first();
	} else {
		user = message.guild.members.find(m => m.id === mention);
	}

	if (user) {
		if (user.roles.find(r => r.name === 'Refugee')) {
			const memberRole = message.member.guild.roles.find(r => r.name === 'Member');
	
			user.removeRoles(user.roles).then(u => {
				u.addRole(memberRole).then(u => client.msg(message, 'green', 'success', `${u.displayName} has been approved!`));
			});
		} else {
			client.msg(message, 'red', 'error', `${user.displayName} is not a refugee, cannot approve!`)
		}
	} else {
		return message.reply(`Could not find member.`);
	}
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [
		'app',
	],
	permLevel: 5,
	deleteTrigger: false,
};

exports.help = {
	name: 'approve',
	category: 'Moderation',
	description: 'Approves a refugee',
	usage: 'approve [@user]',
	params: {
		'@user': 'Refugee user'
	},
	examples: [
		'approve @Username#0000'
	]
};