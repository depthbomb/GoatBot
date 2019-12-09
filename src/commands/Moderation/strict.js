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
	let duration;
	if (args.length !== 1 || isNaN(args[0])) {
		duration = client.config.strict_mode.default_expiration;
	} else {
		duration = parseInt(args[0]);
	}

	if (client.strictMode.enabled) {
		client.strictMode.enabled = false;
		return client.msg(message, 'green', 'success', 'Strict mode has been disabled.', false);
	} else {
		client.strictMode.enabled = true;
		client.msg(message, 'green', 'success', `Strict mode has been enabled. Commands may only be used within the <#420816699626094592> channel. This expires in ${duration} minutes.`, false);
		setTimeout(() => {
			client.strictMode.enabled = false;
			return client.msg(message, 'green', 'success', 'Strict mode has expired.', false);
		}, (duration*60*1000));
	}
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [
		'strictmode'
	],
	permLevel: 3,
};

exports.help = {
	name: "strict",
	category: "Moderation",
	description: "Toggles strict mode for 5 minutes, requiring commands to be used in the commands channel",
	usage: "strict [duration?]",
	params: {
		'duration': '(Optional) Time strict mode should last in minutes'
	},
	examples: [
		"strict",
		"strictmode 5"
	]
};