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

const chalk = require('chalk');
module.exports = async client => {
	await client.wait(1000);
	client.online = true;
	client.disableEveryone = true;
	client.disabledEvents = [
		'TYPING_START',
		'VOICE_SERVER_UPDATE',
		'MESSAGE_REACTION_REMOVE',
		'MESSAGE_REACTION_REMOVE_ALL',
		'CHANNEL_PINS_UPDATE',
		'USER_NOTE_UPDATE',
		'RELATIONSHIP_ADD',
		'RELATIONSHIP_REMOVE'
	];

	client.user.setPresence({
		status: "online",
		afk: false,
		game: {
			name: client.localMode ? '<DEV MODE>' : client.config.initialGame,
			type: 0
		}
	});

	console.log(chalk.bgCyan.whiteBright(`Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`));
};