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

const request = require('request');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const uri = 'https://dog.ceo/api/breeds/image/random';
	request({
		headers: {
			'User-Agent': client.config.userAgent
		},
		uri: uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);
		if (data.status) {
			const image = data.message;
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setImage(image)
				.setTitle('Random Dog');
			return message.reply({ embed });
		} else {
			return message.reply('API call was not successful.');
		}
	});
};

exports.conf = {
	enabled: true,
	cooldown: 15,
	globalCd: false,
	aliases: [
		'dogs',
		'doggo',
		'doggos',
	],
	permLevel: 0,
};

exports.help = {
	name: 'dog',
	category: 'Random',
	description: 'Get a random dog image',
	usage: 'dog',
	params: {},
	examples: [
		'dog'
	]
};