/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
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
	if (args.length < 1) return;
	const request = require('request');
	const msg = encodeURI(args.join(' '));
	const api_key = client.config.cleverbot_api_key;

	message.channel.startTyping();

	let state;
	let api_url = `http://www.cleverbot.com/getreply?key=${api_key}&input=${msg}&cs=${state}`;

	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: api_url,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);

		const data = JSON.parse(body);
		state = data.cs;

		message.channel.stopTyping();
		return message.reply(data.output);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 2,
	globalCd: true,
	aliases: [
		't',
		'cb',
		'talk'
	],
	permLevel: 0
};

exports.help = {
	name: "cleverbot",
	category: "Fun",
	description: "Talk to a bot",
	usage: "cleverbot [message]",
	params: {
		"message": "Message to send to the bot"
	},
	examples: [
		"cleverbot hello!",
		"t hi there"
	]
};