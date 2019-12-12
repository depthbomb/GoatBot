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

const moment = require('moment');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length < 2) return;
	const db = client.db.reminders.get('reminders');
	const userId = message.author.id;
	const channelId = message.channel.id;
	const inputFormat     = args[0];
	const reminderMessage = args.slice(1).join(' ');
	const timeFormatRegex = /(\d+w)?(\d+d)?(\d+h)?(\d+m)?/i;
	const converter       = { m: 60, h: 60*60, d: 60*60*24, w: 60*60*24*7 };

	if (timeFormatRegex.test(inputFormat)) {
		if (reminderMessage.length > 750) return client.msg(message, 'red', 'error', 'Your reminder message is too long.');
		const uuid = client.uuid();
		let matches = timeFormatRegex.exec(inputFormat);
			matches.shift();					//	Remove first item from matches (full group match, useless in this case)
			matches = matches.filter(Boolean);	//	Remove all undefined/blank/false values

		let arrival;
		let duration = 0;
		const now = client.timestamp();
		for (let match of matches) {
			const dur = match.replace(/[0-9]/g, '');
			const num = parseInt(match.replace(/\D/g, ''));
			const out = num * converter[dur];
			duration = (duration + out);
		}
		arrival = (now + duration);

		if (duration < 60) return client.msg(message, 'red', 'error', 'Your reminder delay is too short. Minimum 1 minute (1m).');

		db.push({ uuid, channelId, userId, arrival, reminderMessage, createdAt: now }).write();

		const embed = new RichEmbed()
			  .setTitle('Reminder Set')
			  .setColor(client.colors.green)
			  .setDescription(`Your reminder has been successfully set and it will be sent in this channel.\nTo cancel this reminder, type \`${client.config.prefix}rcancel ${uuid}\`\nType \`${client.config.prefix}rlist\` to see all of your active reminders`)
			  .addField('Arrival', moment.unix(arrival).format('dddd, MMMM Do YYYY, HH:mm:ss'))
			  .addField('Message', `\`\`\`${reminderMessage}\`\`\``);

		return message.channel.send({ embed });
	} else {
		return client.msg(message, 'red', 'error', 'The time format you supplied is invalid. See command examples for correct usage.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 60,
	aliases: [
		'remind',
		'reminder'
	],
	permLevel: 0
};

exports.help = {
	name: 'remindme',
	category: 'Reminders',
	description: 'Sets a reminder, limit 1 per user',
	usage: 'remindme [time] [message]',
	params: {
		'time': 'Time format for reminder (see examples)',
		'message': 'Message attached to the reminder'
	},
	examples: [
		'remindme 1d4h This reminder is from 1 day and 4 hours in the past!',
		'remindme 1m This reminder is from 1 minute in the past!'
	]
};