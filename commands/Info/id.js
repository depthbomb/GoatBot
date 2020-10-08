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
	MissingArgumentError.assert(args.length > 0, 'Please provide a target');

	let subject;
	let type;
	let name;

	if (message.mentions.members.size > 0) {
		type = 'User';
		subject = message.mentions.members.first();
		name = subject.user.tag;
	} else if (message.mentions.channels.size > 0) {
		type = 'Channel';
		subject = message.mentions.channels.first();
		name = subject.name;
	} else if (message.mentions.roles.size > 0) {
		type = 'Role';
		subject = message.mentions.roles.first();
		name = subject.name;
	} else {
		return message.reply('Invalid mentions');
	}

	return message.channel.send(`${type} ID for ${name}: \`${subject.id}\``);
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'id',
	category: 'Info',
	description: 'Gets the ID of a user, channel, or role via mention',
	usage: 'id [mention]',
	params: {
		'mention': 'User, channel, or role mention'
	},
	examples: [
		'id @Username#0000',
		'id #channel-name',
		'id @role'
	]
};