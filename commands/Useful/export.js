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

const fs = require('fs');
const path = require('path');

const HTML = ''

exports.run = async (client, message, args, level) => {
	let numMessages = parseInt(args.join(' ').trim()) || 100;
	if (numMessages > 500) numMessages = 500;
	if (numMessages < 1) numMessages = 1;

	const channel  = message.channel;
	const id       = channel.id;
	channel.messages.fetch({ limit: numMessages }).then(msgs => {
		const data = {
			channel: {
				id: channel.id,
				name: channel.name,
				topic: channel.topic
			 },
			messages: []
		};
		for (let msg of msgs.array()) {
			data.messages.push({
				author: {
					username: msg.member.displayName,
					avatar: msg.author.displayAvatarURL({ size: 64, dynamic: true }),
					color: msg.member.roles.highest.hexColor
				},
				message: msg.content,
				attachments: msg.attachments,
				created: msg.createdTimestamp
			});
		}

		fs.writeFile('export.json', JSON.stringify(data), err => {
			if (err) throw new Error(err);
		});
	});
};

exports.conf = {
	enabled: true,
	cooldown: 60,
	globalCd: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'export',
	category: 'Useful',
	description: 'Exports N amount of messages in the channel to a file',
	usage: 'export [number]',
	params: {
		'number': 'Number of messages to export. Max 500, default of 100'
	},
	examples: [
		'export 150',
	]
};