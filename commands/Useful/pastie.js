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

/**
 * I use the native https module because I can't figure out how to format the request with the "request" library
 * as Hastebin requires you to send data without a field name.
 */
const https = require('https');
const { MissingArgumentsError, InvalidArgumentsError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentsError.assert(args.length > 0, 'Please provide code to upload.');
	const code = args.slice(0).join(' ') || null;

	const msg = await message.channel.send('Processing...');

	InvalidArgumentsError.assert(code !== null, 'Code provided is empty or null.');
	
	msg.edit('Uploading...');
	const options = {
		hostname: 'pastie.io',
		port: 443,
		path: '/documents',
		method: 'POST',
		headers: {
			'Content-Length': code.length
		}
	};
	const req = https.request(options, res => {
		res.on('data', d => {
			let data;
			try {
				data = JSON.parse(d);
			} catch (e) {
				return msg.edit('There was an error uploading to Pastie. This is likely a problem on their end.');
			}
			
			return msg.edit(`<@${message.author.id}>, https://pastie.io/${data.key}`);
		});
		res.on('error', err => message.reply(`**Error**: ${err}`));
	});

	req.write(code);
	req.end();
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	globalCd: true,
	aliases: [
		'paste',
		'hastebin',
		'pastebin'
	],
	permLevel: 0
};

exports.help = {
	name: 'pastie',
	category: 'Useful',
	description: 'Uploads text to Pastie (Pastebin alternative)',
	usage: 'pastie [text]',
	params: {
		'text': 'Text to upload. For the best result, do not send the code in a code block.'
	},
	examples: [
		'pastie console.log("hello world");',
	]
};