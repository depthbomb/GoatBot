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

/**
* TODO: Cleanup/rewrite!
*/
exports.run = async (client, message, args, level) => {
	if (args.length < 2) return;
	const { RichEmbed } = require('discord.js');
	const moment = require('moment');
	const giveawayLimit = args[0];
	const giveawayItem = args.slice(1).join(' ');

	let timeLeft = giveawayLimit;
	let description = `"${giveawayItem}"`;
	let entered = [];	//	Use our own collection since I've had trouble in the past with the library's
	let filter = cm => cm.content.toLowerCase() === 'enter' || cm.content.toLowerCase() === '!enter';

	let embed = new RichEmbed()
		.setColor(client.colors.default)
		.setTitle(description)
		.setDescription(`Type \`enter\` to enter.\n\nTime left: **${timeLeft}** seconds`);

	message.channel.send('🎉 Giveaway! 🎉', { embed }).then(msg => {
		let collector = message.channel.createMessageCollector(filter, { time: (giveawayLimit * 1000) });
		let updateTimeLeft = setInterval(() => {
			timeLeft--;
		}, (1 * 1000));
		let updateEmbed = setInterval(() => {
			embed = new RichEmbed()
				.setTitle(description)
				.setDescription(`Type \`enter\` to enter.\n\nTime left: **${timeLeft}** seconds`)

			if (timeLeft < 6) {
				embed.setColor('#ff0000').addField('\u200b', "\n***Time's almost up!***");
			} else {
				embed.setColor(client.colors.default);
			}

			msg.edit('🎉 Giveaway! 🎉', { embed });
		}, (1.5 * 1000));

		collector.on('collect', m => {
			if (entered.includes(m.author.id)) {
				m.delete((5*1000));	//	Delete the enter message after 5 seconds of sending
			} else {
				entered.push(m.author.id);	//	Store the mention because I'm lazy
				m.react('✅');
			}
		});

		collector.on('end', () => {
			clearInterval(updateEmbed);
			clearInterval(updateTimeLeft);

			if (entered.length < 1) {
				return message.channel.send(`No one entered the giveaway for **${giveawayItem}**\n\nA winner cannot be chosen.`).then(() => {
					msg.delete();
				});
			} else {
				let winner = entered.shuffle()[0];
				winnerText = `Congratulations, <@!${winner}>! You've won **${giveawayItem}**`;

				return message.channel.send(winnerText).then(() => {
					embed = new RichEmbed()
						.setColor('#000000')
						.setTitle(description)
						.setDescription(`<@!${winner}> has won this giveaway.`)
						.setFooter('Ended')
						.setTimestamp();
					msg.edit('🎉 **GIVEAWAY ENDED!** 🎉', { embed });
				});
			}
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		'ga',
		'raffle'
	],
	permLevel: 3
};

exports.help = {
	name: 'giveaway',
	category: 'Fun',
	description: 'Starts a giveaway. Users can enter by reacting with the appropriate emoji.',
	usage: 'giveaway [time] [winners] [item]',
	params: {
		'time': 'Time in seconds the giveaway should last for',
		'winners': 'Number of winners',
		'items': 'Item being given away'
	},
	examples: [
		'giveaway 60 1 My Virginity'
	]
};