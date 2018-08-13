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
	const path = require('path');
	const { RichEmbed } = require('discord.js');
	const moment = require('moment-timezone');
	const ms = require('ms');
	const Parser = require('rss-parser');
	const request = require('request');

	const tasks = {

		check_config: {
			interval: 10,
			action: () => {
				const oldConfig = JSON.stringify(client.config);
				const newConfig = JSON.stringify(require(path.join(client.rootPath, 'config.js')).config);

				if (oldConfig === newConfig) {
					delete require.cache[path.join(client.rootPath, 'config.js')];
				} else {
					delete require.cache[path.join(client.rootPath, 'config.js')];
					client.config = require(path.join(client.rootPath, 'config.js')).config;
				}
			}
		},

		change_game: {
			interval: (60 * 60),
			action: () => {
				const quotes = client.config.playingGames.shuffle();
				client.user.setPresence({
					status: "online",
					afk: false,
					game: {
						name: quotes[0],
						type: 0
					}
				});
			}
		},

		check_rss: {
			interval: 60,
			action: () => {
				const parser = new Parser();

				(async () => {
					const feed = await parser.parseURL(client.config.rss.url);

					if (feed.items.length < 1) return;
					
					const latest = feed.items[0];
					const cacheFile = path.join(client.cachePath, 'rss', encodeURIComponent(latest.link) + '.cache');

					//	If the latest feed item is not cached
					if (!fs.existsSync(cacheFile)) {
						const content = latest.content
							.replace(/<br>/g, '\n')	//	Replace line break tags with actual line breaks before stripping HTML
							.replace(/<(.|\n)*?>/g, '');

						const embed = new RichEmbed()
							.setColor(client.config.color)
							.setTitle(latest.title)
							.setURL(latest.link)
							.setFooter('Via Cyan.TF Steam Group')
							.setDescription(client.trunc(content, 900, {ellipsis: "..."}))
							.setTimestamp();
						
						const outputChannel = client.channels.find(c => c.id === client.config.rss.output_channel);
						fs.writeFile(cacheFile, JSON.stringify(latest), (err) => {
							return outputChannel.send({ embed });
						});
					}
				})();
			}
		},

		check_bans: {
			interval: 30,
			action: () => {
				request(client.config.sourcebans.bans_url, (err, res, body) => {
					if (err) throw new Error(err);	//	Should probably handle errors better, but this works for now...
					const data = JSON.parse(body);
					const outputChannel = client.channels.find(c => c.id === client.config.sourcebans.output_channel);
					Object.keys(data).forEach(key => {
						const banEntry = data[key];
						const cacheFile = path.join(client.cachePath, 'sb', `b_${key}.cache`);
						const admins = {
							'0': 'CONSOLE',
							'1': 'depthbomb',
							'57': 'Discount'
						};
						if (!fs.existsSync(cacheFile)) {
							const expiration = banEntry.length !== '0' ? 'for ' + ms((banEntry.length*1000), {long: 1}) : 'permanently';
							const embed = new RichEmbed()
								.setColor(client.colors.red)
								.setURL(`https://cyan.tf/bans/index.php?p=banlist&advSearch=${banEntry.authid}&advType=steamid&Submit`)
								.setTitle('User banned')
								.setDescription(`User **${banEntry.name}** was banned ${expiration} by ${admins.hasOwnProperty(banEntry.aid) ? admins[banEntry.aid] : 'ADMIN'}.`)
								.addField('Reason', banEntry.reason)
								.addField('Date', moment.unix(banEntry.created).tz("America/Chicago").format('MM/DD/YY, HH:mm:ss z'));
							
							fs.writeFile(cacheFile, JSON.stringify(data[key]), (err) => {
								return outputChannel.send({ embed });
							});
						}
					});
				});
			}
		},

		check_comms: {
			interval: 30,
			action: () => {
				request(client.config.sourcebans.comms_url, (err, res, body) => {
					if (err) throw new Error(err);
					const data = JSON.parse(body);
					const outputChannel = client.channels.find(c => c.id === client.config.sourcebans.output_channel);
					Object.keys(data).forEach(key => {
						const commEntry = data[key];
						const cacheFile = path.join(client.cachePath, 'sb', `c_${key}.cache`);
						const admins = {
							'0': 'CONSOLE',
							'1': 'depthbomb',
							'57': 'Discount'
						};
						const types = {
							1: 'muted',
							2: 'gagged'
						};
						if (!fs.existsSync(cacheFile)) {
							const expiration = commEntry.length !== '0' ? 'for ' + ms((commEntry.length*1000), {long: 1}) : 'permanently';
							const embed = new RichEmbed()
								.setColor(client.colors.orange)
								.setTitle('User ' + types[commEntry.type])
								.setDescription(`User **${commEntry.name}** was ${types[commEntry.type]} ${expiration} by ${admins.hasOwnProperty(commEntry.aid) ? admins[commEntry.aid] : 'ADMIN'}.`)
								.addField('Reason', commEntry.reason !== '' ? commEntry.reason : '_No reason specified._') // Check for a reason for comms because SB doesn't allow blank reasons for bans, for some reason
								.addField('Date', moment.unix(commEntry.created).tz("America/Chicago").format('MM/DD/YY, HH:mm:ss z'));
							
							fs.writeFile(cacheFile, JSON.stringify(data[key]), (err) => {
								return outputChannel.send({ embed });
							});
						}
					});
				});
			}
		},

		refresh_allowances__images: {
			interval: 60,
			action: () => {
				if (!client.config.allowances.enabled) return;
				const allowances = client.allowances.images;
				const now = moment().format('X');

				for (const key of Object.keys(allowances)) {
					const user = allowances[key];
					if (user.expires < now) {
						delete allowances[key];
						console.log('Refreshing image allowance for ', key);
					}
				};
			}
		},

		refresh_allowances__urls: {
			interval: 60,
			action: () => {
				if (!client.config.allowances.enabled) return;
				const allowances = client.allowances.links;
				const now = moment().format('X');

				for (const key of Object.keys(allowances)) {
					const user = allowances[key];
					if (user.expires < now) {
						delete allowances[key];
						console.log('Refreshing URL allowance for ', key);
					}
				};
			}
		},
	};


	/**
	* Run the tasks
	*/
	for (const key of Object.keys(tasks)) {
		const task = tasks[key];
		setInterval(() => {
			return task.action();
		}, (task.interval * 1000));
	};
};