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

const { MessageEmbed } = require('discord.js');
const { MissingArgumentError, InvalidArgumentError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length > 0, 'Please provide a question.');
	const question = args.join(' ');
	InvalidArgumentError.assert(question.endsWith('?'), 'Question must end with a question mark.');
	const responses = [
		// Affirmative
		"It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes, definitely",
		"You may rely on it",
		"As I see it, yes",
		"Most likely",
		"Outlook good",
		"Yes",
		"Signs point to yes",

		// Non-committal
		"Reply hazy, try again",
		"Ask again later",
		"Better not tell you now",
		"Cannot predict now",
		"Concentrate and ask again",

		// Negative
		"No",
		"Nope",
		"Don't count on it",
		"My reply is no",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful"
	];
	const embed = new MessageEmbed()
		  .setColor('#232323')
		  .setDescription(`\:8ball: <@${message.author.id}>, ${responses.shuffle()[0]}`);
	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'8b'
	],
	permLevel: 0
};

exports.help = {
	name: '8ball',
	category: 'Random',
	description: 'Ask the Magic 8-Ball (almost) anything!',
	usage: '8ball [question]',
	params: {
		'question': 'Question to ask, must end with ?'
	},
	examples: [
		'8ball Will I ever get married?'
	]
};