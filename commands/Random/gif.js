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

const request = require('request');
const { MessageEmbed } = require('discord.js');
const { InvalidArgumentCountError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	InvalidArgumentCountError.assert(args.length >= 1, 'Please provide a keyword');
	const keywords = encodeURIComponent(args.join(' ').trim());
	const uri = 'https://api.gfycat.com/v1/gfycats/search?search_text=' + keywords;
	request({
		headers: {
			'User-Agent': client.config.userAgent
		},
		uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);
		const gfy = data.gfycats.shuffle()[0];
		const embed = new MessageEmbed()
			.setTitle(gfy.title || 'Untitled')
			.setColor('RANDOM')
			.setURL(gfy.url)
			.addField('Tags', gfy.tags.join(', '))
			.setImage(gfy.max5mbGif);
		return message.reply({ embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	globalCd: false,
	aliases: [
		'randomgfy',
		'randomgyf',
		'rgif',
		'rgfy',
		'rgyf',
	],
	permLevel: 0,
};

exports.help = {
	name: 'randomgif',
	category: 'Random',
	description: 'Gets a random GIF from Gfycat based on the keywords you provide',
	usage: 'randomgif [keywords]',
	params: {
		'keywords': 'Keywords to search'
	},
	examples: [
		'randomgif goat'
	]
};