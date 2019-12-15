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

module.exports = client => {
	return task = {
		name: 'heartbeat',
		description: 'Manages the bot\'s heartbeat. Restarts the bot if there are abnormalities.',
		enabled: true,
		hidden: true,
		interval: 30,
		action: () => {
			const heartbeat = client.heartbeat;
			const time = Math.floor(new Date() / 1000);
			if ((heartbeat + 35) < time) {
				client.log('error', `Last heartbeat is behind by ${time - heartbeat} seconds. Restarting bot...`);
				client.destroy();
				process.exit(1);
			} else {
				if (client.online) client.heartbeat = time;
			}
		}
	};
};