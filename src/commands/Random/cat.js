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
	const uri = 'http://aws.random.cat/meow';
	const request = require('request');
	const { RichEmbed } = require('discord.js');

	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);
		const image = data.file;
		const embed = new RichEmbed()
			.setColor('RANDOM')
			.setImage(image)
			.setTitle('Random Cat');
		return message.reply({ embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	globalCd: false,
	aliases: [
		"cat",
		"kitty",
		"kitten",
		"kiki",
		"gato",
	],
	permLevel: 0,
	deleteTrigger: false,
};

exports.help = {
	name: "cat",
	category: "Random",
	description: "Get a random cat image",
	usage: "cat",
	params: {},
	examples: [
		"cat"
	]
};