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

const ms = require('ms');
const moment = require('moment');
const { RichEmbed } = require('discord.js');

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

	return durations.join(', ');
};

exports.run = (client, message, args, level) => {
	const requestedTask = args.join(' ') || null;
	const tasks = client.tasks.filter(t => t.enabled === true);
	const embed = new RichEmbed().setColor(client.colors.brand);

	console.log(tasks);

	if (requestedTask) {
		const task = tasks.find(t => t.name == requestedTask);
		if (task) {
			console.log(task);
			embed.setTitle(requestedTask);
			const taskLastRan = task.lastRan;
			const interval = ms(task.interval*1000, false);
			const lastRan = (taskLastRan > 0 ? moment.unix(taskLastRan).format('M/DD/YYYY, HH:mm:ss') : 'Never');
			const nextRun = moment.unix(taskLastRan > 0 ? (taskLastRan + task.interval) : (client.started + task.interval)).format('M/DD/YYYY, HH:mm:ss');

			embed.addField('Interval', interval)
				 .addField('Last ran', lastRan)
				 .addField('Next run', nextRun);
		} else {
			return message.reply(`No such task \`${requestedTask}\`.`);
		}
	} else {
		embed.setTitle('Running tasks');
		
		const taskList = [];
		for (let i = 0; i < tasks.length; i++) taskList.push(`${i+1}. ${tasks[i].name}`);

		embed.setDescription(`There are currently ${tasks.length} tasks running.\nYou can view additional info about a task by typing \`${client.printCmd('task')} [task name]\`\n\`\`\`markdown\n${taskList.join('\n')}\`\`\``);
	}

	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'task'
	],
	permLevel: 0,
};

exports.help = {
	name: 'tasks',
	category: 'Dev',
	description: 'Shows the bot\'s enable, automated tasks',
	usage: 'tasks [task?]',
	params: {
		'task': 'Task to view info on'
	},
	examples: [
		'tasks heartbeat'
	]
};