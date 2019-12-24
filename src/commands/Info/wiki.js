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
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const query = args.join(' ') || 'random';
	const params = Object.entries({
		action: 'query',
		prop: 'extracts|pageimages',
		format: 'json',
		titles: query,
		exintro: '',
		explaintext: '',
		pithumbsize: 500,
		redirects: '',
		formatversion: 2
	}).map(p => p.map(encodeURIComponent).join('='))
	.join('&');
	const uri = 'https://en.wikipedia.org/w/api.php?' + params;
	const image = 'https://www.wikipedia.org/static/apple-touch/wikipedia.png';
	let msg = await message.reply('Sending request...');
	request({
		headers: { 'User-Agent': client.config.userAgent },
		uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body).query.pages[0];
		if (data.missing) {
			return msg.edit('No results!');
		} else {
			const articleUrl = 'https://en.wikipedia.org/?curid=' + data.pageid;
			const extract = data.extract
				  .replace('\n', '\n\n')
				  .replace(/\s*\(\)\s*/, '');
			const embed = new RichEmbed()
				  .setColor(0xFFFFFF)
				  .setAuthor('Wikipedia', image, articleUrl)
				  .setURL(articleUrl)
				  .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
				  .setDescription(extract.limit());

			if (extract.length > 2000) embed.addField('Continue reading ', `[${data.title}](${articleUrl})`, true);
	
			return msg.edit({ embed });
		}
	});
};

exports.conf = {
	enabled: true,
	aliases: [
		'wikipedia',
	],
	permLevel: 0,
};

exports.help = {
	name: 'wiki',
	category: 'Info',
	description: 'Searches Wikipedia for your query',
	usage: 'wiki [query]',
	params: {
		'query': 'Your query, duh'
	},
	examples: [
		'wiki JavaScript'
	]
};