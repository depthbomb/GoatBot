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

const { MissingArgumentError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length > 0, 'Please provide a number.');
	let num;
	if (args.length !== 1) {
		num = 10; // to 10 messages
	} else {
		num = parseInt(args[0]);
	}

	if (num > 100) num = 100;

	let n = 0;
	message.delete().then(() => {
		message.channel.messages.fetch({ limit: num }).then(messages => {
			client.disableLog = true;
			for (let msg of messages) {
				msg.delete().then(() => {
					n++;
					if (n === num) {
						console.log('Done hardpurging');
						client.disableLog = false;
					}
				});
			}
		});
	});
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: 'hardpurge',
	category: 'Moderation',
	description: 'Purges a number of messages in the current channel, without using bulkDelete',
	usage: 'nsfw [number?]',
	params: {
		'number': 'Number of messages to purge from the current channel. Defaults to 10'
	},
	examples: [
		'hardpurge 15'
	]
};