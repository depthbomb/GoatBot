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

let infoMessageId = null;
const ms = require('ms');
const gamedig = require('gamedig');
const { MessageEmbed } = require('discord.js');
module.exports = client => {
	return task = {
		name: 'updateServerInfo',
		description: 'Displays info on the TF2 server in the designated text channel',
		enabled: false,
		interval: 60,
		action: async () => {
			const infoChannel = client.channels.cache.find(c => c.id === client.config.serverInfo.channel);

			await infoChannel.messages.fetch();

			const messageCache = infoChannel.messages.cache;

			if (messageCache.array().length > 0) {
				infoMessageId = messageCache.last().id;
			}

			gamedig.query({
				type: 'tf2',
				host: client.config.serverInfo.address
			}).then(state => {
				const padding    = 15;
				const serverName = state.name;
				const serverMap  = state.map;
				const maxPlayers = state.maxplayers;
				const players    = state.players;

				const embed = new MessageEmbed()
					.setTitle(serverName)
					.setColor(client.colors.brand)
					.setFooter('Updated')
					.setTimestamp()
					.addField('Players', `${players.length}/${maxPlayers}`, true)
					.addField('Map', serverMap, true);

				if (players.length > 0) {
					// Sort the players by score (descending)
					players.sort((a, b) => b.score - a.score);

					let playersList  = [
						`${'Name'.padEnd(padding)}${'Score'.padEnd(padding)}Time`
					];

					for (let player of players) {
						let line;
						if (Object.keys(player).length < 1) {
							line = `${'<Connecting>'.padEnd(padding)}${'0'.padEnd(padding)}`;
						} else {
							line = `${player.name.limit(15).padEnd(padding)}${player.score.toString().padEnd(padding)}${ms(Math.round(player.time*1000))}`;
						}
						playersList.push(line);
					}

					embed.addField('Players List', players.length > 0 ? playersList.join('\n') : `Nobody here but us chickens. Why not [hop on?](steam://connect/${client.config.serverInfo.address}:27015)`);
				} else {
					embed.addField('Players List', `Nobody here but us chickens. Why not hop on?`)
				}

				if (infoMessageId !== null) {
					const messageToEdit = infoChannel.messages.cache.first();
					messageToEdit.edit({ embed });
				} else {
					let msg = infoChannel.send({ embed });
					infoMessageId = msg.id;
				}
			}).catch(_ => console.error(_));
		}
	};
};