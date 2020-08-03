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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const Reminder = require('@models/Reminder');
const { MissingArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length === 1, 'Please provide a reminder ID.');
	const uuid = args.join(' ');
	const userId = message.author.id;

	Reminder.findById(uuid, 'userId', (err, reminder) => {
		if (err) return message.reply(err.message);
		if (reminder) {
			if (reminder.userId === userId || level >= 2) {
				Reminder.deleteOne({ _id: uuid }, (err, doc) => {
					if (err) throw new Error(err);
					return client.msg(message, 'green', 'success', 'Reminder has been cancelled!');
				});
			} else {
				return client.msg(message, 'red', 'error', 'You do not have permission to cancel this reminder.');
			}
		} else {
			return client.msg(message, 'red', 'error', 'That reminder does not exist.');
		}
	});
};

exports.conf = {
	enabled: true,
	aliases: [
		'remindercancel',
		'remindcancel',
		'remindmecancel',
	],
	permLevel: 0
};

exports.help = {
	name: 'cancelreminder',
	category: 'Reminders',
	description: 'Cancels a reminder',
	usage: 'cancelreminder [uuid]',
	params: {
		'uuid': 'Cancels a reminder of yours by its UUID'
	},
	examples: [
		'cancelreminder 95a38c8a-a4cd-486b-ba42-79df1309ec1d',
	]
};