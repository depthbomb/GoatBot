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

exports.run = (client, message, args, level) => {
	const { RichEmbed } = require('discord.js');

	const emoji = {
		furdesire: client.emojis.find('name', 'furdesire'),
		pandasurprise: client.emojis.find('name', 'pandasurprise'),
	};

	const panel1 = [emoji.furdesire, '\:b:', emoji.pandasurprise];
	const panel2 = [emoji.furdesire, '\:b:', emoji.pandasurprise];
	const panel3 = [emoji.furdesire, '\:b:', emoji.pandasurprise];

	const choice1 = panel1.shuffle()[0];
	const choice2 = panel2.shuffle()[0];
	const choice3 = panel3.shuffle()[0];

	return message.reply(`${choice1} | ${choice2} | ${choice3}`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 3,
	aliases: [
		'sm'
	],
	permLevel: 0
};

exports.help = {
	name: "slotmachine",
	category: "Fun",
	description: "Play the slots",
	usage: "slotmachine",
	examples: [
		"slotmachine",
		"sm"
	]
};