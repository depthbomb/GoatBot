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

const { RichEmbed } = require('discord.js');
const moment = require('moment');

function formatInterval(interval) {
	const hours   = Math.floor(interval / 3600);
	const minutes = Math.floor((interval - (hours * 3600)) / 60);
	const seconds = interval - (hours * 3600) - (minutes * 60);
	const durations = [];
	if (hours > 0)
		durations.push(hours + 'h');
	if (minutes > 0)
		durations.push(minutes + 'm');
	if (seconds > 0)
		durations.push(seconds + 's');

	return durations.join(' ');
};

exports.run = (client, message, args, level) => {
	const tasks = client.tasks;
	const embed = new RichEmbed()
		  .setColor(client.colors.brand)
		  .setDescription('Tasks are pieces of code that run automatically on their own intervals.')
		  .setTimestamp();

	tasks.forEach(task => {
		const interval = formatInterval(task.interval);
		const lastRan = "\n* Last ran: " + (task.lastRan > 0 ? moment.unix(task.lastRan).fromNow() : 'Never')
		embed.addField(task.name, `\`\`\`markdown\n* ${task.description}\n* Interval: ${interval}${lastRan}\`\`\``);
	});

	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 1,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: "tasks",
	category: "Dev",
	description: "Shows the bot's enable automated tasks",
	usage: "tasks"
};