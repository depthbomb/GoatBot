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
	const moment = require('moment');
	const target = args[0];
	const time = args[1];
	const user = message.mentions.users.first();
	const now = moment();

	let expiration;
	if (typeof time !== 'undefined') {
		expiration = now.add(time, 'm');
	} else {
		expiration = now.add(30, 'm');
	}

	client.db.all(`SELECT userid, active FROM mutes WHERE userid = "${user.id}" LIMIT 1`, (err, rows) => {
		if (err) throw new Error(err);
		
		if (rows.length > 0) {
			let row = rows[0];
			if (row.active) {
				client.db.run(`UPDATE mutes SET active = "0" WHERE userid = "${user.id}"`, () => {
					return message.reply(`[DEBUG] Unmuted ${user.tag}`);
				});
			}
		} else {
			client.db.run("INSERT INTO mutes (guid, userid, date, expiration) VALUES (?, ?, ?, ?)", [client.uuid(), user.id, now.format('X'), expiration.format('X')], () => {
				message.guild.members.find('id', user.id).setMute(true, 'Muted by GoatBot!').then(mem => {
					return message.reply(`[DEBUG] Muted ${user.tag} until ${expiration.format('dddd, MMMM Do YYYY, HH:mm:ss')}`);
				});
			});
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 5
};

exports.help = {
	name: "m",
	category: "Moderation",
	description: "Mutes or unmutes a user",
	usage: "mute [@user] [duration]",
	params: {
		'@user': 'User mention to mute',
		'duration': 'Length of the mute, defaults to 30 minutes'
	},
	examples: [
		"mute @UserName#0000 5"
	]
};