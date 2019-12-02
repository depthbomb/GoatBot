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
	const action = args[0];

	let isDonor;
	if (message.member.roles.find(r => r.name === client.config.roles.donor)) {
		isDonor = true;
	} else {
		isDonor = false;
	}

	if (action === 'help') {
		return message.reply('Coming soon!');
	} else if (action === 'status') {
		return message.reply(isDonor ? 'You are labled as a donor!' : 'You are not labled as a donor.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		'd'
	],
	cooldown: 5,
	permLevel: 0
};

exports.help = {
	name: "donor",
	category: "Fun",
	description: "Donor super command",
	usage: "donor [action] [..args?]",
	params: {
		"action": "Action to use in the command. Use 'help' for list of actions",
		"..args?": "(Optional) Arguments that an action may have. May require multiple arguments"
	},
	examples: [
		"donor help",
		"donor status"
	]
};