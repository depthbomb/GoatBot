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

const exec = require('execa');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const command   = args[0];
	const arguments = args.slice(1);
	try {
		let { stdout } = await exec(command, arguments);
			stdout = stdout.trim();
		if (stdout.length > 0) {
			return message.reply(stdout, { code: 'bash' });
		} else {
			return message.reply('Command executed!');
		}
	} catch (err) {
		return client.msg(message, 'red', 'error', err);
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'execute'
	],
	permLevel: 5,
};

exports.help = {
	name: 'exec',
	category: 'Dev',
	description: 'Executes a shell command and returns its output',
	usage: 'exec [command] [..args?]',
	params: {
		'command': 'Command to execute',
		'..args?': '(Optional) Arguments for the command'
	},
	examples: [
		'exec ls',
		'exec pm2 stop goat'
	]
};