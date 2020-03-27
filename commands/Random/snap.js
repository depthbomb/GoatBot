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
	const guild = message.member.guild;
	const members = guild.members.random(Math.ceil(guild.members.size / 2));

	let unlucky = [];

	for (let i = 0; i < members.length; i++) {
		const user = members[i];
		unlucky.push(user.displayName);
	}

	return message.reply(`***Balance has been brought to the guild, these ${unlucky.length} members have been killed***\n\`\`\`\n${unlucky.join('\n')}\`\`\``);
};

exports.conf = {
	enabled: true,
	cooldown: 3600,
	globalCd: true,
	aliases: [
		'thanos'
	],
	permLevel: 0,
};

exports.help = {
	name: 'snap',
	category: 'Random',
	description: 'Bring balance to the guild',
	usage: 'snap',
	examples: [
		'snap',
		'thanos'
	]
};