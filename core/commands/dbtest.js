/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
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
	const mysql = require('mysql');
	const action = args.join(' ');
	const queries = {
		create: "CREATE TABLE IF NOT EXISTS `test` (`id` INT(10) AUTO_INCREMENT, `creator` BIGINT NOT NULL, `content` VARCHAR(2000) NOT NULL, PRIMARY KEY (`id`))"
	};
	const db = mysql.createConnection(client.db);

	db.query(queries.create, (err, result, fields) => {
		if (err) return message.reply('Error: ' + err);

		console.log(result, fields);

		return message.reply('Created table: ' + db.threadId);
	});

	db.end();
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 1,
	aliases: [],
	permLevel: 10,
	deleteTrigger: true,
};

exports.help = {
	name: "dbtest",
	category: "System",
	description: "Database testing command",
	usage: "dbtest",
	params: {},
	examples: [],
};