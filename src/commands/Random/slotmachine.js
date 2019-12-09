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

exports.run = (client, message, args, level) => {
	const { RichEmbed } = require('discord.js');
	const emoji = {
		furdesire: client.emojis.find(e => e.name === 'furdesire'),
		pandasurprise: client.emojis.find(e => e.name === 'pandasurprise'),
		dab: client.emojis.find(e => e.name === 'dab'),
	};
	const choices = [emoji.furdesire, '\:b:', emoji.pandasurprise, '\:eggplant:'];
	const choice1 = choices.shuffle()[0];
	const choice2 = choices.shuffle()[0];
	const choice3 = choices.shuffle()[0];

	let jackpotText;
	if (choice1 === choice2 && choice2 === choice3) {
		jackpotText = '***Jackpot!***';
	} else {
		jackpotText = 'Better luck next time!';
	}

	return message.reply(`${choice1} | ${choice2} | ${choice3}\n${jackpotText}`);
};

exports.conf = {
	enabled: true,
	cooldown: 3,
	globalCd: true,
	aliases: [
		'sm'
	],
	permLevel: 0,
};

exports.help = {
	name: "slotmachine",
	category: "Random",
	description: "Play the slots",
	usage: "slotmachine",
	examples: [
		"slotmachine",
		"sm"
	]
};