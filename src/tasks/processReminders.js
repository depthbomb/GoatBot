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
module.exports = client => {
	return task = {
		name: 'processReminders',
		description: 'Processes due reminders',
		enabled: true,
		hidden: false,
		interval: 5,
		action: () => {
			const now = client.timestamp();
			const query = { arrival: { $lte: now } };
			const indices = '_id userId channelId arrival reminderMessage';
			Reminder.find(query, indices, (err, reminders) => {
				for (let rem of reminders) {
					const uuid = rem._id;
					const userId = rem.userId;
					const user   = client.users.find(u => u.id == userId);
					const embed = new RichEmbed()
						  .setTitle(`Your reminder`)
						  .setColor(client.colors.brand)
						  .setDescription(rem.reminderMessage);

					Reminder.findOneAndRemove({ _id: uuid }, (err, doc) => {
						if (err) throw new Error(err);
					});

					return user.send({ embed });
				}
			});
		}
	};
};