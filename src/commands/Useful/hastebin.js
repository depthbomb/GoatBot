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

/**
 * I use the native https module because I can't figure out how to format the request with the "request" library
 * as Hastebin requires you to send data without a field name.
 */
const https = require('https');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const code = args.slice(0).join(' ') || null;
	let msg = await message.channel.send('Processing...');
	if (code) {
		msg.edit('Uploading...');
		const options = {
			hostname: 'hastebin.com',
			port: 443,
			path: '/documents',
			method: 'POST',
			headers: {
				'Content-Length': code.length
			}
		};
		const req = https.request(options, res => {
			res.on('data', d => {
				const data = JSON.parse(d);
				return msg.edit(`<@${message.author.id}>, https://hastebin.com/${data.key}`);
			});
			res.on('error', err => message.reply(`**Error**: ${err}`));
		});

		req.write(code);
		req.end();
	} else {
		return message.reply('You didn\'t supply any text to upload, silly.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	globalCd: true,
	aliases: [
		'pastebin'
	],
	permLevel: 0
};

exports.help = {
	name: 'hastebin',
	category: 'Useful',
	description: 'Uploads text to Hastebin (Pastebin alternative)',
	usage: 'hastebin [text]',
	params: {
		'text': 'Text to upload'
	},
	examples: [
		'hastebin console.log("hello world");',
	]
};