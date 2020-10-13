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

const url = require('url');
const path = require('path');
const capture = require('capture-website');
const { MissingArgumentError } = require('@core/errors');
const blacklistedHosts = [ 'pornhub.com', 'xhamster.com', 'redtube.com', '4chan.org', '4channel.org', '4cdn.org', 'gelbooru.com' ];
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length > 0, 'Please supply a website URL.');
	let website = args[0];
	const file = `screenshot_${client.snowflake()}.jpg`;
	const fullPath = path.join(client.tmpPath, file);
	const msg = await message.reply('Checking URL...');
	let providedURL = new url.parse(website);

	if (!providedURL.protocol) {
		providedURL = new url.parse('https://' + website);
	}

	if (blacklistedHosts.some(s => providedURL.host.includes(s))) {
		msg.edit('The website you provided is blacklisted.');
	} else {
		(async() => {
			msg.edit('Attempting to capture website...');
			
			try {
				await capture.file(website, fullPath, {
					width: 1600,
					height: 900,
					type: 'jpeg',
					scaleFactor: 2,
					quality: 0.67,
					fullPage: true,
					delay: 1,
				});
			} catch {
				msg.edit('Failed to capture website, connection timed out');
				return;
			}
	
			msg.edit('Uploading image...');
	
			message.channel.send({ files: [{ attachment: fullPath, name: file }] });
	
			msg.delete();
	
			client.queue.add(function() {
				require('fs').unlinkSync(fullPath);
			}, 30);
		})();
	}
};

exports.conf = {
	enabled: true,
	cooldown: 15,
	aliases: [
		'wsss'
	],
	permLevel: 0,
};

exports.help = {
	name: 'websitescreenshot',
	category: 'Images',
	description: 'Takes a screenshot of the website provided',
	usage: 'websitescreenshot [URL]',
	params: {
		'URL': 'URL to website'
	},
	examples: [
		'websitescreenshot https://google.com',
		'wsss https://youtube.com'
	]
};