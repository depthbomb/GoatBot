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
	if (args.length < 1) return;
	const { RichEmbed } = require('discord.js');
	const Chance = require('chance');
	let subject = args.join(' ');
	const seed = subject.toLowerCase().usToSp().trim();

	if (subject.match(/<@!?\d{17,19}>/g)) {
		subject = message.mentions.members.first().displayName;
	}
	const chance = new Chance(seed);
	const rating = chance.integer({ min: 0, max: 10 });
	const ratings = [
		{ color: '#e75a70', emoji: '\:broken_heart:' },		//	0
		{ color: '#e75a70', emoji: '\:broken_heart:' },		//	1
		{ color: '#e75a70', emoji: '\:broken_heart:' },		//	2
		{ color: '#e75a70', emoji: '\:broken_heart:' },
		{ color: '#be1931', emoji: '\:heart:' },
		{ color: '#be1931', emoji: '\:heart:' },
		{ color: '#e75a70', emoji: '\:heartbeat:' },
		{ color: '#e75a70', emoji: '\:heartbeat:' },
		{ color: '#e75a70', emoji: '\:heartbeat:' },
		{ color: '#e75a70', emoji: '\:sparkling_heart:' },
		{ color: '#e75a70', emoji: '\:two_hearts:' },
	];
	const embed = new RichEmbed()
		.setColor(ratings[rating].color)
		.setDescription(`Hmm... I rate \`${subject}\` **${rating}/10!** ${ratings[rating].emoji}`)
	;

	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		'rating'
	],
	permLevel: 0,
	deleteTrigger: false,
};

exports.help = {
	name: "rate",
	category: "Fun",
	description: "Have the bot rate the attractiveness of your subject.",
	usage: "rate [subject]",
	params: {
		'subject': 'Subject being rated'
	},
	examples: [
		"subject yer mum"
	]
};