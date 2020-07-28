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

const crypto = require('crypto');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args, level) => {
	if (args.length != 1) return;
	const crashCode = args.join('').trim();
	const decoded   = Buffer.from(crashCode, 'base64').toString();
	const exploded  = decoded.split('::');

	const key  = client.config.crypto.key;
	const iv   = Buffer.from(exploded[1], 'hex');
	const data = Buffer.from(exploded[2], 'hex');
	
	let decipher  = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(data);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
	
	const embed = new MessageEmbed()
		  .setColor(client.colors.green)
		  .setDescription(decrypted);

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'stacktrace',
		'tracestack'
	],
	permLevel: 5,
};

exports.help = {
	name: 'trace',
	category: 'Dev',
	description: 'Decrypts a crash code',
	usage: 'trace [code]',
	params: {
		'code': 'Encrypted crash code'
	},
	examples: [
		'trace R29hdEJvdFN1cGVyU2VjcmV0U3RhY2tUcmFjZUNyYXNoQ29kZTo6...'
	]
};