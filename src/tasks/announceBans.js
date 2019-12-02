/**
 * Checks for new SourceBans punishments and announces them
 */
// module.exports = async (client) => {
// 	const fs = require('fs');
// 	const path = require('path');
// 	const { RichEmbed } = require('discord.js');
// 	const request = require('request');
// 	const moment = require('moment-timezone');
// 	const ms = require('ms');
// 	return task = {
// 		interval: 30,
// 		action: () => {
// 			request(client.config.sourcebans.bans_url, (err, res, body) => {
// 				if (err) return console.log(err);
				
// 				try {
// 					const data = JSON.parse(body);
// 					const outputChannel = client.channels.find(c => c.id === client.config.sourcebans.output_channel);
// 					Object.keys(data).forEach(key => {
// 						const banEntry = data[key];
// 						const cacheFile = path.join(client.cachePath, 'sb', `b_${banEntry['bid']}.cache`);
// 						const admins = {
// 							'0': 'CONSOLE',
// 							'1': 'depthbomb',
// 							'31': 'Sarah Bear',
// 							'57': 'Discount'
// 						};
// 						if (!fs.existsSync(cacheFile)) {
// 							const reason = banEntry.reason.trim() || "No reason specified";
// 							const expiration = banEntry.length > 0 ? 'for ' + ms((banEntry.length*1000), {long: 1}) : 'permanently';
// 							const embed = new RichEmbed()
// 								.setColor(client.colors.red)
// 								.setURL(`https://cyan.tf/bans/index.php?p=banlist&advSearch=${banEntry.authid}&advType=steamid&Submit`)
// 								.setTitle('Player banned')
// 								.setDescription(`Player **${banEntry.name}** was banned ${expiration} by ${admins.hasOwnProperty(banEntry.aid) ? admins[banEntry.aid] : 'ADMIN'}.`)
// 								.addField('Reason', reason)
// 								.addField('Date', moment.unix(banEntry.created).tz("America/Chicago").format('MM/DD/YY, HH:mm:ss z'));
							
// 							fs.writeFile(cacheFile, JSON.stringify(data[key]), (err) => {
// 								return outputChannel.send({ embed });
// 							});
// 						}
// 					});
// 				} catch (error) {
// 					return console.log(error);
// 				}
// 			});
// 		}
// 	};
// };