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

exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const messageID = args.join(' ');
	message.channel.message.fetch(messageID)
	.then(msg => msg.delete().then(() => message.delete()))
	.catch(console.error);
};

exports.conf = {
	enabled: true,
	aliases: [
		'del',
		'delet'
	],
	permLevel: 2,
};

exports.help = {
	name: 'delete',
	category: 'Moderation',
	description: 'Deletes a message by ID',
	usage: 'delete [message ID]',
	params: {
		'message ID': 'ID of the message you want to delete'
	},
	examples: [
		'delete 357686677051985921'
	]
};