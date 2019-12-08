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

module.exports = (client) => {
	return task = {
		enabled: false,
		interval: 60,
		action: () => {
			const colors = [ '#e81123', '#f7630d', '#ffb901', '#107c0f', '#0063b1', '#881898' ];
			const role = client.guilds.find(g => g.id === '186978265557237762').roles.find(r => r.name === 'Gay');
			const currentColor = role.hexColor;
			const currentPosition = colors.indexOf(currentColor);

			let nextColor;
			if (currentPosition === 5) {
				nextColor = colors[0];
			} else {
				nextColor = colors[currentPosition + 1];
			}

			role.setColor(nextColor);
			client.db.update('rainbowRole', nextColor).write();
		}
	};
};