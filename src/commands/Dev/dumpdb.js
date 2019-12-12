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

const fs = require('fs'),
	  path = require('path');
const databases = [ 'core', 'reminders', 'warnings' ];
exports.run = (client, message, args, level) => {
	const database = args.join(' ').toLowerCase() || 'core';
	if (databases.includes(database)) {
		const db = JSON.stringify(client.db[database].value(), null, 4);
		if (db.length > 1900) {
			const filePath = path.join(process.cwd(), `dump_${database}_${client.uuid()}.json`);
			fs.writeFile(filePath, db, err => {
				return message.reply('Database dump is too long to send, I have uploaded instead.', { file: { attachment: filePath } })
				.then(() => fs.unlinkSync(filePath));
			});
		} else {
			return message.reply(db, { code: 'json' });
		}
	} else {
		return client.msg(message, 'red', 'error', `Database \`${database}\` does not exist. Valid options are ${databases.join(', ')}.`);
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'getdb',
		'dbdump'
	],
	permLevel: 10,
};

exports.help = {
	name: 'dumpdb',
	category: 'Dev',
	description: 'Dumps database data',
	usage: 'dumpdb [database?]',
	params: {
		'database': '(Optional) Database to dump, defaults to "core" if none specified'
	},
	examples: [
		'dumpdb',
		'dumpdb reminders'
	]
};