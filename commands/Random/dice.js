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
const { InvalidArgumentsError, InvalidArgumentCountError } = require('@errors');
exports.run = async (client, message, args, level) => {
	InvalidArgumentCountError.assert(args.length > 1, 'Both arguments are required.');

	const numSides = args[0];

	InvalidArgumentsError.assert(!isNaN(numSides), 'Number of sides must be a number, duh dummy!');
	InvalidArgumentsError.assert(numSides >= 2 && numSides <= 999999999, 'Number of sides must be between 2 and 999999999.');

	const numDice = args[1];
	
	InvalidArgumentsError.assert(!isNaN(numDice), 'Number of dice must be a number, duh dummy!');
	InvalidArgumentsError.assert(numDice >= 1 && numDice <= 100, 'Number of dice must be between 0 and 100');

	const results = client.randomInt(1, numSides, numDice, 1);

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
	usage: 'dice [side count] [die count]',
	params: {
		'side count': 'Number of sides per dice',
		'dice count': 'Number of dice to roll'
	},
	examples: [
		'dice 5 10',
	]
};