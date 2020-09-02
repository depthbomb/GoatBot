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
const { MissingArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length > 0, 'Please provide a URL');
	const url = args.join('').trim();
	const uri = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${client.config.apiKeys.googleapis}`;

	let msg = await message.channel.send('Checking...');
	request({
		uri,
		method: 'POST',
		json: {
			client: {
				clientId: 'GoatBot',
				clientVersion: '1.0',
			},
			threatInfo: {
				threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
				platformTypes: ['ALL_PLATFORMS'],
				threatEntryTypes: ['URL'],
				threatEntries: [
					{ url }
				]
			}
		}
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = body;
		console.log(data);
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'safebrowse',
	category: 'Info',
	description: 'Uses Google\'s Safe Browsing API to determine if a URL is safe',
	usage: 'safebrowse [url]',
	params: {
		'url': 'URL to analyze'
	},
	examples: [
		'safebrowse https://youtube.com'
	]
};