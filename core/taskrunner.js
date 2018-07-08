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
	const cron = require('node-cron');

	/**
	* Every minute
	*/
	cron.schedule('* * * * *', () => {
		const Parser = require('rss-parser');
		const parser = new Parser();

		(async () => {
			const feed = await parser.parseURL(client.config.rss.url);

			if (feed.items.length < 1) return;

			const latest = feed.items[0];
			const cacheFile = path.join(client.cachePath, 'rss', encodeURIComponent(latest.link) + '.cache');

			//	If the latest feed item is not cached
			if (!client.fileExists(cacheFile)) {
				const { RichEmbed } = require('discord.js');

				const content = latest.content
								.replace(/<br>/g, '\n')	//	Replace line break tags with actual line breaks before stripping HTML
								.replace(/<(.|\n)*?>/g, '');

				const embed = new RichEmbed()
								.setColor(client.config.color)
								.setTitle(latest.title)
								.setURL(latest.link)
								.setFooter('Via Cyan.TF Steam Group')
								.setDescription(client.trunc(content, 900, {ellipsis: "..."}))
								.setTimestamp()
				
				const outputChannel = client.channels.find('id', client.config.rss.output_channel);
				return outputChannel.send({ embed }).then(() => {
					fs.writeFileSync(cacheFile, JSON.stringify(latest));
				});
			}
		})();
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