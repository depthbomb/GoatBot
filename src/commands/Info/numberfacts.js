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

const request = require('request');
exports.run = async (client, message, args, level) => {
	const number = args[0] || 'random';
	const type   = args.slice(1).join(' ').toLowerCase() || 'trivia';
	const uri    = `http://numbersapi.com/${number}/${type}`;

	request({
		uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.msg(message, 'red', 'error', err);
		if (body.startsWith('Cannot')) {
			return message.reply('Invalid format');
		} else {
			return message.reply(`\`\`\`${body}\`\`\``);
		}
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'numberfact',
		'numbersfact',
		'numbersfacts'
	],
	permLevel: 0,
};

exports.help = {
	name: 'numberfacts',
	category: 'Info',
	description: 'Get facts about a number or date',
	usage: 'numberfact [number?] [type?]',
	params: {
		'number?': 'Number or month/day if [type] is "date". Can also be "random", which it will default to',
		'type': '(Optional) trivia, math, date, or year. Defaults to "trivia"'
	},
	examples: [
		'numberfacts',
		'numberfacts 42',
		'numberfacts 69 trivia',
		'numberfacts 2/29 date',
		'numberfacts random year'
	]
};