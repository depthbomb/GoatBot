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

exports.run = (client, message, args, level) => {
	const { version } = require("discord.js");
	const moment = require("moment");
	require("moment-duration-format");

	const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
	return message.channel.send(`My Statistics
-------------
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Node       :: ${process.version}`

, {code: "asciidoc"});
};

exports.conf = {
	enabled: true,
	aliases: [
		"statistics"
	],
	permLevel: 0,
};

exports.help = {
	name: "stats",
	category: "System",
	description: "Bot statistics",
	usage: "stats",
	examples: [
		"stats"
	]
};