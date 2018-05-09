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

module.exports = async (client) => {
	const fs = require('fs');
	const cron = require('node-cron');
	const moment = require('moment');

	/**
	* The almighty task runner! This uses cron jobs to run various things
	*
	* TODO: A more graceful way to do this
	*/


	cron.schedule('*/1 * * * *', () => {
		client.db.all(`SELECT * FROM mutes WHERE expiration <= ${moment().format('X')} AND active = 1`, (err, rows) => {
			if (err) throw new Error(err);
			if (rows) {	//	Found some!
				rows.forEach(mute => {
					client.fetchUser(mute.userid).then(user => {

						const guild = client.guilds.find('id', '186978265557237762');
						const mem = guild.members.find('id', user.id);

						mem.setMute(false, 'Unmuted by GoatBot!').then(m => {
							client.db.run(`UPDATE mutes SET active = 0 WHERE guid = '${mute.guid}'`, (err) => {
								if (err) throw new Error(err);
								client.log("debug", `Unmuted ${mem.nickname}`);
							});
						});


					}).catch((err) => {
						client.log("error", `Failed to send reminder message to user:\n\n${err}`);
					});
				});
			}
		});
	});


	/**
	* Every hour
	*/
	cron.schedule('0 * * * *', () => {
		const quotes = client.config.playingGames.shuffle();

		client.user.setPresence({
			status: "online",
			afk: false,
			game: {
				name: quotes[0],
				type: 0
			}
		});

	});
};