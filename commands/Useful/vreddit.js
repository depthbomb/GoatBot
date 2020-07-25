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

const fs = require('fs'),
	path = require('path'),
	https = require('https'),
	request = require('request');
exports.run = async (client, message, args, level) => {
	if(args.length === 0) return;
	const uri = args[0] + '.json';
	
	request({
		uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body)[0].data.children[0].data;
		const videoName = encodeURIComponent(data.title);
		const videoFile = data.secure_media.reddit_video.fallback_url;
		const audioFile = videoFile
							.replace('DASH_96', 'audio')
							.replace('DASH_360', 'audio')
							.replace('DASH_720', 'audio')
							.replace('DASH_1080', 'audio');
		
		https.get(audioFile, res => {
			if (res.statusCode !== 403) {
				// video + audio
			} else {
				//	video only
			}
		});
	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	globalCd: false,
	aliases: [],
	permLevel: 5
};

exports.help = {
	name: 'vreddit',
	category: 'Useful',
	description: 'Downloads a Reddit video from its URL',
	usage: 'vreddit [post URL]',
	params: {
		'post URL': 'URL of the Reddit video post'
	},
	examples: [
		'vreddit https://www.reddit.com/r/Thatsactuallyverycool/comments/h0zm09',
		'vreddit https://www.reddit.com/h0zm09',
	]
};