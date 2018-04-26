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

exports.run = async (client, message, args, level) => {
	if (!args || args.length < 2) return message.reply("Both arguments are required.");

	const randnum = require('random-number-between');
	const pluralize = require('pluralize');

	const numDice = args[0];
	const maxNum = args[1];

	if(maxNum < 2 || maxNum > 1001) {
		message.channel.send('Number of dice sides must be greater than 1 and less than or equal to 1000');
		return;
	}
	if(numDice > 100) {
		message.channel.send('Number of dice rolled must be 100 or smaller');
		return;
	}

	let results = randnum(1, maxNum, numDice);

	message.reply(`:game_die: Rolled ${numDice} ${maxNum}-sided ${pluralize('die', numDice)} and got ***${results.join(', ')}*** :game_die:`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		'roll'
	],
	permLevel: 0
};

exports.help = {
	name: "dice",
	category: "Fun",
	description: "Roll a dice.",
	usage: "dice [die count] [side count]",
	params: {
		"die count": "Number of die to roll",
		"side count": "Number of sides per die"
	},
	examples: [
		"dice 5 10"
	]
};