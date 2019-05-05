/**
 * Checks for new SourceBans punishments and announces them
 */
module.exports = async (client) => {
	const fs = require('fs');
	const path = require('path');
	const { RichEmbed } = require('discord.js');
	const request = require('request');
	const ms = require('ms');
	const moment = require('moment-timezone');
	return task = {
		interval: 500,
		action: () => {
			request('https://cyan.tf/api/suggestions', (err, res, body) => {
				if (err) return console.log(err);
				const types = [ 'Map', 'SaySound', 'Rebalance', 'Plugin' ];
				try {
					const data = JSON.parse(body);
					if (data.success) {
						const outputChannel = client.channels.find(c => c.id === '514587177813016588');
						data.results.forEach(suggestion => {
	
							const cacheFile = path.join(client.cachePath, 'suggestions', `s_${suggestion.uuid}.cache`);
							if (!fs.existsSync(cacheFile)) {
								const suggestionUrl = `https://cyan.tf/suggestions/${suggestion.uuid}`;
								const suggestionType = types[(suggestion.type - 1)];
								const suggestionTitle = suggestion.title;
								const suggestionContent = suggestion.content;
								const suggestionAuthor = suggestion.author.username;
								const suggestionAvatar = suggestion.author.avatar;
								const suggestionCreated = suggestion.created_at;
		
								const embed = new RichEmbed()
									.setAuthor(suggestionAuthor, suggestionAvatar, suggestionUrl)
									.setColor(client.colors.green)
									.setURL(suggestionUrl)
									.setTitle(`New ${suggestionType} Suggestion`)
									.setDescription(`**${suggestionAuthor}** has posted a new suggestion on the Cyan.TF website. A preview of the details are below.`)
									.addField(suggestionTitle, suggestionContent);
									
								fs.writeFile(cacheFile, JSON.stringify(suggestionUrl), (err) => {
									return outputChannel.send({ embed });
								});
							}
						});
					}
				} catch (error) {
					return console.log(error);
				}
			});
		}
	};
};