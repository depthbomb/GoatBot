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
exports.run = async (client, message, args, level) => await exec('pm2', ['restart', 'goat']);

exports.conf = {
	enabled: true,
	aliases: [
		'reboot'
	],
	permLevel: 5,
};

exports.help = {
	name: 'restart',
	category: 'Dev',
	description: 'Restarts the bot via PM2',
	usage: 'restart',
	params: {},
	examples: [
		'restart'
	]
};