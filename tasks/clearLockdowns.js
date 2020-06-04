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

const { MessageEmbed } = require('discord.js');
module.exports = client => {
	return task = {
		name: 'clearLockdowns',
		description: 'Clears expired channel lockdowns',
		enabled: true,
		interval: 5,
		action: () => {
			if (client.online) {
				const lockdowns = client.store.lockdowns;
				const now = client.timestamp();
				const channels = Object.keys(lockdowns);
				for (let channel of channels) {
					if (lockdowns[channel] <= now) {
						delete lockdowns[channel];
						const channelToMessage = client.channels.cache.find(c => c.id == channel);
						const embed = new MessageEmbed()
							  .setColor(client.colors.blue)
							  .setDescription('The lockdown on this channel has expired.');
						channelToMessage.send({ embed });
					}
				}
			}
		}
	};
};