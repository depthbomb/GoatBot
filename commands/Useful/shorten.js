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
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const longUrl = args.join(' ').trim().replace('<', '').replace('>', '');
	const uri = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + client.config.apiKeys.firebase;
	request({
		method: 'POST',
		body: JSON.stringify({
			dynamicLinkInfo: {
				domainUriPrefix: 'https://goatbot.page.link',
				link: longUrl
			},
			suffix: {
				option: 'SHORT'
			}
		}),
		uri,
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);
		const embed = new MessageEmbed()
			  .addField('Short Link', data.shortLink)
			  .setColor(client.colors.brand);

		message.reply({ embed });
		message.delete();
	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	globalCd: false,
	aliases: [
		'shortenurl',
		'shorturl',
	],
	permLevel: 0
};

exports.help = {
	name: 'shorten',
	category: 'Useful',
	description: 'Generates a goo.gl link from the provided URL',
	usage: 'shorten [URL]',
	params: {
		'URL': 'The URL to shorten'
	},
	examples: [
		'shorten https://www.youtube.com/',
	]
};