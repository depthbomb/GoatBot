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

const Chance = require('chance'),
	  chance = new Chance();
module.exports = client => {
	return task = {
		name: 'changeGame',
		description: 'Changes the bot\'s "playing" game.',
		enabled: !client.localMode,
		hidden: true,
		interval: 60*30,
		action: () => {
			const quote = chance.weighted(client.config.status.statuses, client.config.status.weights);
			client.user.setPresence({
				status: 'online',
				afk: false,
				game: {
					name: quote,
					type: 0
				}
			});
		}
	};
};