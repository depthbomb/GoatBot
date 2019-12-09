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

const Chance = require('chance'),
	  chance = new Chance();
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const difficulty = args[0].toLowerCase() || 'easy';
	let settings = {};
	switch (difficulty) {
		default:
		case 'easy':
			settings = {
				mode: 1,
				max: 10,
				time: 10
			};
			break;
		case 'medium':
		case 'med':
		case 'mid':
			settings = {
				mode: 1,
				max: 50,
				time: 30
			};
			break;
		case 'hard':
			settings = {
				mode: 1,
				max: 75,
				time: 45
			};
			break;
		case 'impossible':
		case 'i':
			settings = {
				mode: 1,
				max: 100,
				time: 45
			};
			break;
	}

	const chosenNumber = chance.integer({ min: 1, max: settings.max });
	const time = settings.time;

	let embed = new RichEmbed()
		.setTitle(`RNG (${difficulty})`)
		.setColor(client.colors.default)
		.setDescription(`I have chosen a number between **1** and **${settings.max}**\n\nEveryone in this channel can guess by typing a number.\n\nThe game will end if __${time} seconds__ has elapsed.\n\n**GO**.`);

	const msg = await message.channel.send({ embed });

	if (settings.mode < 2) {
		message.channel.awaitMessages(m => m.cleanContent.trim() === `${chosenNumber}`, { max: 1, time: (time*1000), errors: ['time'] }).then(col => {
			const winner = col.first().member;
			embed = new RichEmbed()
				.setTitle('RNG')
				.setColor(client.colors.green)
				.setDescription(`<@${winner.user.id}> has guessed the number first (0 - ${settings.max})!\n**The number was __${chosenNumber}__!**`);
			msg.delete().then(m => {
				m.channel.send({ embed })
			});
		}).catch(() => {
			embed = new RichEmbed()
				.setTitle('RNG')
				.setColor(client.colors.red)
				.setDescription(`No one guessed the number (0 - ${settings.max})!\n**The number was __${chosenNumber}__!**`);
			msg.delete().then(m => {
				m.channel.send({ embed })
			});
		});
	} else {

	}
};

exports.conf = {
	enabled: true,
	aliases: [
		"numberguess",
		"numguess",
		"guessnumber",
		"guessnum",
		"ng",
	],
	permLevel: 0
};

exports.help = {
	name: "rng",
	category: "Games",
	description: "I come up with a number and people have to guess it!",
	usage: "rng [difficulty?]",
	params: {
		"difficulty": "(Optional) Easy (default), medium or hard."
	},
	examples: [
		"rng",
		"rng medium"
	]
};