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

exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const db = client.db.get('reminders');
	const snowflake = args.join(' ');
	const userId = message.author.id;
	const reminder = (userId === client.config.ownerId) ?
					 db.find({ snowflake }).value() :
					 db.find({ snowflake, userId }).value();
	if (reminder) {
		db.remove({ snowflake }).write();
		return client.msg(message, 'green', 'success', 'That reminder has been cancelled!');
	} else {
		return client.msg(message, 'red', 'error', 'That reminder does not exist or you do not have access to cancelling it.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 1,
	aliases: [
		'remindercancel',
		'remindcancel',
		'remindmecancel',
		'rcancel'
	],
	permLevel: 0
};

exports.help = {
	name: 'cancelreminder',
	category: 'Reminders',
	description: 'Cancels a reminder',
	usage: 'cancelreminder [snowflake]',
	params: {
		'snowflake': 'Cancels a reminder of yours by its Snowflake'
	},
	examples: [
		'cancelreminder 421890328492034',
	]
};