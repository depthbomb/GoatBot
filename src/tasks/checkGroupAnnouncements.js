/**
 * Checks for Steam group announcements and announces them
 */
// module.exports = async (client) => {
// 	const fs = require('fs');
// 	const path = require('path');
// 	const Parser = require('rss-parser');
// 	const { RichEmbed } = require('discord.js');
// 	return task = {
// 		interval: 60,
// 		action: () => {
// 			if (!client.doSteamGroupAnnouncements) return;
// 			const parser = new Parser();

// 			try {
// 				(async () => {
// 					const feed = await parser.parseURL(client.config.rss.url);
	
// 					if (feed.items.length < 1) return;
	
// 					const latest = feed.items[0];
// 					const cacheFile = path.join(client.cachePath, 'rss', encodeURIComponent(latest.link) + '.cache');
	
// 					//	If the latest feed item is not cached
// 					if (!fs.existsSync(cacheFile)) {
// 						const content = latest.content
// 							.replace(/<br>/g, '\n') //	Replace line break tags with actual line breaks before stripping HTML
// 							.replace(/<(.|\n)*?>/g, '');
	
// 						const embed = new RichEmbed()
// 							.setColor(client.config.color)
// 							.setTitle(latest.title)
// 							.setURL(latest.link)
// 							.setFooter('Via Cyan.TF Steam Group')
// 							.setDescription(client.trunc(content, 900, {
// 								ellipsis: "..."
// 							}))
// 							.setTimestamp();
	
// 						const outputChannel = client.channels.find(c => c.id === client.config.rss.output_channel);
// 						fs.writeFile(cacheFile, JSON.stringify(latest), (err) => {
// 							return outputChannel.send({
// 								embed
// 							});
// 						});
// 					}
// 				})();
// 			} catch (error) {
// 				client.doSteamGroupAnnouncements = false;
// 				return console.log(error);
// 			}
// 		}
// 	};
// };