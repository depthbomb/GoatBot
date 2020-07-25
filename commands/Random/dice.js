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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const pluralize = require('pluralize');
exports.run = async (client, message, args, level) => {
	if (args.length < 1) return message.reply('Both arguments are required.');
	const numSides = args[0];
	let numDice = args[1];
	
	if (isNaN(numDice) || args.length < 2) numDice = 1;

	if (isNaN(numSides)) return message.reply('Number of sides must be a number, duh dummy!');
	if (numSides < 2 || numSides > 999999999) return message.reply('Number of sides must be between 2 and 999999999.');

	if (isNaN(numDice)) return message.reply('Number of dice must be a number, duh dummy!');
	if (numDice < 1 || numDice > 100) return message.reply('Number of dice must be between 0 and 100');

	let results = client.randomInt(1, numSides, numDice, 1);

	return message.reply(`:game_die: Rolled ${numDice} ${numSides}-sided ${pluralize('die', numDice)} and got ***${results.join(', ')}*** :game_die:`);
};

exports.conf = {
	enabled: true,
	aliases: [
		'roll'
	],
	permLevel: 0
};

exports.help = {
	name: 'dice',
	category: 'Random',
	description: 'Roll a dice.',
	usage: 'dice [side count] [die count?]',
	params: {
		'side count': 'Number of sides per die',
		'die count': '(Optional) Number of die to roll, defaults to 1 if not specified or non-numeric'
	},
	examples: [
		'dice 5 10',
		'dice 6'
	]
};