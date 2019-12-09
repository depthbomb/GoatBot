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
	if (args.length < 1) return;

	const arg = args[0];
	const channelId = message.channel.id;

	if (arg === 'off') {
		client.slowMode.channels = {};
		return client.msg(message, 'green', 'success', `Slow mode has been disabled in this channel.`);
	} else {
		try {
			if (client.isNaN(arg)) return;

			const timeout = parseInt(arg);

			if (timeout > 60 || timeout < 5) return client.msg(message, 'red', 'error', 'Timeout must be between 5 and 60 seconds.');
			const { RichEmbed } = require('discord.js');

			client.slowMode.channels[channelId] = {enabled: true, timeout: (timeout * 1000), users: []};

			return client.msg(message, 'green', 'success', `This channel (<#${message.channel.id}>) has been put into _slow mode._ Users may only send a message once every ${timeout} seconds.`);
		} catch (error) {
			console.log(error);
		}
	}
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	globalCd: true,
	aliases: [
		'slow',
		'throttle'
	],
	permLevel: 5,
};

exports.help = {
	name: "slowmode",
	category: "Moderation",
	description: "Put the current channel in slow mode. Messages will be deleted if subsequent ones are sent before the user's timeout",
	usage: "slowmode [timeout]",
	examples: [
		"slowmode 10"
	]
};