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

const path = require('path'),
	  execa = require('execa');
const { MissingArgumentsError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentsError.assert(args.length > 0, 'Please provide a URL.');
	const url = args[0];
	const downloadPath = path.join(client.tmpPath, client.uuid() + '.mp3');
	const ytdlArgs = [
		'-x',
		'-f',
		'bestaudio',
		'--audio-format',
		'mp3',
		'--geo-bypass',
		'--no-check-certificate',
		url,
		'--output',
		downloadPath,
	];

	const msg = await message.channel.send('Grabbing video info...');

	//	TODO: parse output/errors
	const { stdout, stderr } = await execa(path.join(client.binPath, 'youtube-dl.exe'), ytdlArgs);

	msg.delete().then(m => {
		return message.channel.send({
			files: [{
				attachment: downloadPath
			}]
		});
	});
};

exports.conf = {
	enabled: true,
	cooldown: 15,
	globalCd: true,
	aliases: [
		'youtubemp3'
	],
	permLevel: 0
};

exports.help = {
	name: 'ytmp3',
	category: 'Useful',
	description: 'Downloads the audio of a YouTube video',
	usage: 'ytmp3 [YouTube URL]',
	params: {
		'YouTube URL': 'URL of the YouTube video that you want to extract the MP3 from'
	},
	examples: [
		'ytmp3 https://www.youtube.com/watch?v=ZJL4UGSbeFg',
	]
};