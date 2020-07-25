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

exports.run = (client, message, args, level) => {
	let num;
	if (args.length !== 1) {
		num = 10;				//	Default to 10 messages
	} else {
		num = parseInt(args[0]);
	}

	if (num > 100) num = 100;	//	We can only purge 100 messages at most

	message.delete().then(() => {
		message.channel.bulkDelete(num, true).catch(e => {
			console.trace(e);
		});
	});
};

exports.conf = {
	enabled: true,
	aliases: [
		'prune'
	],
	permLevel: 3
};

exports.help = {
	name: 'purge',
	category: 'Moderation',
	description: 'Purges a number of messages in the current channel',
	usage: 'purge [number?]',
	params: {
		'number': 'Number of messages to purge from the current channel. Defaults to 10'
	},
	examples: [
		'purge 15'
	]
};