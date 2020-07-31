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

const dictionary = [];
const { codes } = require('@errors');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (dictionary.length === 0) {
		for (let key of Object.keys(codes)) {
			const code = codes[key];
			const entry = { name: key, code: code.code, message: code.message };
			dictionary.push(entry);
		}
	}

	const embed = new MessageEmbed()
		  .setColor(client.colors.red)
		  .setTitle('Error Codes');

	for (let entry of dictionary) {
		embed.addField(entry.code, `**${entry.name}** - ${entry.message}`);
	}

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'ecodes'
	],
	permLevel: 0,
};

exports.help = {
	name: 'errorcodes',
	category: 'Dev',
	description: 'Displays error codes utilized by the bot',
	usage: 'errorcodes',
	params: {},
	examples: [
		'errorcodes'
	]
};