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
	const db = client.db.get('reminders');
	const userId = message.author.id;
	const reminders = db.filter({ userId }).sortBy('createdAt').value();
	if (reminders.length > 0) {
		const embed = new RichEmbed()
			  .setTitle(`${message.member.displayName}'s Reminders`)
			  .setColor(client.colors.brand)
			  .setDescription(`You can cancel a reminder by typing \`${client.config.prefix}rcancel [uuid]\``);

		for (let rem of reminders) {
			embed.addField(`About ${moment.unix(rem.arrival).toNow()} (${rem.uuid})`, rem.reminderMessage);
		}
		
		return message.reply({ embed });
	} else {
		return client.msg(message, 'red', 'error', 'You do not have any reminders to list.');
	}
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