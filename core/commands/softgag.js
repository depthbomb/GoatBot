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

exports.run = (client, message, args, level) => {
	const target = args[0];
	const table = 'softgags';
	const user = message.mentions.users.first();

	const moment = require('moment');

	client.db.all(`SELECT userid, active FROM softgags WHERE userid = "${user.id}" LIMIT 1`, (err, rows) => {
		if (err) throw new Error(err);
		if (rows.length > 0) {
			let row = rows[0];
			if (row.active) {
				client.db.run(`UPDATE softgags SET active = "0" WHERE userid = "${user.id}"`, () => {
					return message.reply(`Ungagged ${user.tag}`);
				});
			} else {
				client.db.run(`UPDATE softgags SET active = "1" WHERE userid = "${user.id}"`, () => {
					return message.reply(`Gagged ${user.tag}`);
				});
			}
		} else {
			client.db.run("INSERT INTO softgags (userid, date) VALUES (?, ?)", [user.id, moment().format('X')], () => {
				return message.reply(`Gagged ${user.tag}`);
			});
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"sg"
	],
	permLevel: 5
};

exports.help = {
	name: "softgag",
	category: "Moderation",
	description: "Adds or removes user from softgag",
	usage: "softgag [@user]",
	params: {
		'@user': 'User mention to gag'
	},
	examples: [
		"softgag @UserName#0000"
	]
};