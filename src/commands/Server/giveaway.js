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

exports.run = async (client, message, args, level) => {
	if (args.length < 2) return;
	const { RichEmbed } = require('discord.js');
	const moment = require('moment');
	const giveawayLimit = args[0];
	const giveawayItem = args.slice(1).join(' ');

	let timeLeft = giveawayLimit;
	let description = `"${giveawayItem}"`;
	let entered = [];	//	Use our own collection since I've had trouble in the past with the library's
	let displayEntered = [];	//	Array of mention strings for displaying, because I'm lazy
	let filter = (r, u) => r.emoji.name === '🎉' && !entered.includes(u.id) && u.id !== client.user.id;

	let embed = new RichEmbed()
		.setColor(client.colors.default)
		.setTitle(description)
		.setDescription(`React with 🎉 to enter.`)
		.setFooter(`Time left: ${timeLeft} seconds`);

	message.channel.send('🎉 Giveaway! 🎉', { embed }).then(msg => {
		msg.react('🎉');
		const collector = msg.createReactionCollector(filter, { time: (giveawayLimit * 1000) });

		let updateTimeLeft = setInterval(() => {
			timeLeft--;
		}, 1000);
		let updateEmbed = setInterval(() => {
			embed = new RichEmbed()
				.setTitle(description)
				.setDescription(`React with 🎉 to enter.`)
				.setFooter(`Time left: ${timeLeft} seconds`);

			if (entered.length > 0) {
				embed.addField('Entries', displayEntered.join('\n'));
			}
			
			if (timeLeft < 11) {
				embed.setColor('#ff0000').addField('\u200b', "\n***Time's almost up!***");
			} else {
				embed.setColor(client.colors.default);
			}

			msg.edit('🎉 Giveaway! 🎉', { embed });
		}, 2000);

		collector.on('collect', r => {
			const userId = r.users.last().id;	//	Get the latest user who reacted
			
			if (!entered.includes(userId)) {
				entered.push(userId);
				displayEntered.push(`<@${userId}>`);
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
				winnerText = `Congratulations, <@${winner}>! You've won **${giveawayItem}**`;

				return message.channel.send(winnerText).then(() => {
					embed = new RichEmbed()
						.setColor('#000000')
						.setTitle(description)
						.setDescription(`<@${winner}> has won this giveaway.`)
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
	aliases: [
		'ga',
		'raffle'
	],
	permLevel: 3,
};

exports.help = {
	name: 'giveaway',
	category: 'Giveaway',
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