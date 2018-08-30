/**
 * Checks for new SourceBans comms punishments and announces them
 */
module.exports = async (client) => {
	const fs = require('fs');
	const path = require('path');
	const { RichEmbed } = require('discord.js');
	const request = require('request');
	const moment = require('moment-timezone');
	const ms = require('ms');
	return task = {
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
							.setTitle('Player ' + types[commEntry.type])
							.setDescription(`Player **${commEntry.name}** was ${types[commEntry.type]} ${expiration} by ${admins.hasOwnProperty(commEntry.aid) ? admins[commEntry.aid] : 'ADMIN'}.`)
							.addField('Reason', commEntry.reason !== '' ? commEntry.reason : '_No reason specified._') // Check for a reason for comms because SB doesn't allow blank reasons for bans, for some reason
							.addField('Date', moment.unix(commEntry.created).tz("America/Chicago").format('MM/DD/YY, HH:mm:ss z'));
						
						fs.writeFile(cacheFile, JSON.stringify(data[key]), (err) => {
							return outputChannel.send({ embed });
						});
					}
				});
			});
		}
	};
};