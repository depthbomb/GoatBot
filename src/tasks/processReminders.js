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

module.exports = async (client) => {
	return task = {
		name: 'processReminders',
		description: 'Processes outstanding reminders',
		enabled: true,
		interval: 30,
		action: () => {
			const moment = require('moment');
			const { RichEmbed } = require('discord.js');
			const now = client.timestamp();
			const db = client.db.get('reminders');
			const reminders = db.value();
			for (let rem of reminders) {
				if (rem.arrival <= now) {
					const uuid = rem.uuid;
					const userId = rem.userId;
					const channel = client.channels.find(c => c.id === rem.channelId);
					const embed = new RichEmbed()
						  .setTitle(`Reminder (from ${moment.unix(rem.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')})`)
						  .setColor(client.colors.brand)
						  .setDescription(rem.reminderMessage);

					db.remove({ uuid }).write();
					channel.send(`<@${userId}>`, { embed });
				}
			}
		}
	};
};