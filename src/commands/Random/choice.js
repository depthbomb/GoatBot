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
	if (!args || args.length < 2 || args.length > 50) return;

	if (args.allValuesSame()) return message.reply('Choices cannot be identical.');

	const choice = args.shuffle()[0].usToSp();
	return message.reply(`I choose... ***${choice}***!`);
};

exports.conf = {
	enabled: true,
	aliases: [
		'choose'
	],
	cooldown: 1.5,
	permLevel: 0
};

exports.help = {
	name: "choice",
	category: "Random",
	description: "Let the bot choose between a list of items",
	usage: "choice [item] [item2] [...?]",
	params: {
		"item": "First choice, use underscores for spacces",
		"item2": "Second choice",
		"...?": "Additional choices, need at least two"
	},
	examples: [
		"choice paper plastic",
		"choose beef pork chicken tofu"
	]
};