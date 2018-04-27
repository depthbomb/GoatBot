/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
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

exports.run = async (client, message, args, level) => {

	return client.msg(message, 'blue', 'info', `You have a permission level of ${level}.`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"lvl",
		"mylevel",
		"mylvl"
	],
	permLevel: 0
};

exports.help = {
	name: "level",
	category: "System",
	description: "Displays your command permission level",
	usage: "level",
	examples: [
		"level"
	]
};