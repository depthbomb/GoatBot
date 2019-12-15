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

const Reminder = require('@models/Reminder');
const moment = require('moment');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;
	Reminder.find({ userId }, '_id arrival reminderMessage', (err, reminders) => {
		if (err) return message.reply(err.message);
		if (reminders.length > 0) {
			const embed = new RichEmbed()
				  .setTitle(`${message.member.displayName}'s Reminders`)
				  .setColor(client.colors.brand)
				  .setDescription(`You can cancel a reminder by typing \`${client.config.prefix}rcancel [uuid]\``);
	
			for (let rem of reminders) {
				//	If the bot has been running without problem a reminder would never be overdue, but just in case...
				const title = rem.arrival <= client.timestamp() ?
					'Overdue!' :
					`In about ${moment.unix(rem.arrival).fromNow(true)}`;
				embed.addField(`${title} (${rem._id})`, rem.reminderMessage);
			}
			
			return message.reply({ embed });
		} else {
			return client.msg(message, 'orange', 'warning', 'You do not have any reminders to list.');
		}
	});
	
};

exports.conf = {
	enabled: true,
	cooldown: 1,
	aliases: [
		'listreminder',
		'rlist',
		'reminderlist',
		'reminderslist'
	],
	permLevel: 0
};

exports.help = {
	name: 'listreminders',
	category: 'Reminders',
	description: 'Lists all of your active reminders',
	usage: 'listreminders',
	params: {},
	examples: [
		'listreminders',
	]
};