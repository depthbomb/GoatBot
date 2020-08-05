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

const translate = require('@k3rn31p4nic/google-translate-api');
const languages = translate.languages;
const languageCodes = Object.keys(languages);
const { MessageEmbed } = require('discord.js');
const { MissingArgumentError, InvalidArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length >= 3, 'You must provide at least three arguments');

	const from = args[0];

	InvalidArgumentError.assert(languageCodes.includes(from), 'The source language code you provided is invalid. You can view a list of the __two-character__ codes [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Table)');

	const to = args[1];

	InvalidArgumentError.assert(languageCodes.includes(from), 'The translation language code you provided is invalid. You can view a list of the __two-character__ codes [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Table)');

	const text = args.slice(2).join(' ').trim();

	InvalidArgumentError.assert(text.length > 0 && text.length <= 1024, 'The text you provided must be 1024 characters or less and greater than zero');

	translate(text, { from, to }).then(res => {
		const embed = new MessageEmbed()
				.setColor('#4284f3')
				.setTitle(`Translating from ${languages[from]} to ${languages[to]}`)
				.addField('Input', (res.from.text.autoCorrected ? `${res.from.text.value} (autocorrected from ${text})` : text), true)
				.addField('Translation', res.text, true);

		return message.channel.send({ embed });
	}).catch(err => {
		console.error(err);
		return message.reply(err);
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'trans'
	],
	permLevel: 0
};

exports.help = {
	name: 'translate',
	category: 'Useful',
	description: 'Translates text using Google Translate',
	usage: 'translate [from] [to] [text]',
	params: {
		'from': 'Language code to translate from',
		'to': 'Language code to translate to',
		'text': 'Text to translate',
	},
	examples: [
		'translate es en rosado'
	]
};