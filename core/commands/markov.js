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
	const text = args.join(' ');
	if (text.length < 3) return;

	message.channel.startTyping();

	const fs = require('fs');
	const path = require('path');

	const markov = require('markov');
	const m = markov(1);

	const seed = fs.createReadStream(path.join(client.rootPath, 'data', 'markov', 'seed.txt'));
	m.seed(seed, () => {
		const response = m.respond(text).join(' ').toLowerCase();
		message.channel.stopTyping();
		return message.reply(response);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 5,
	aliases: [
		'm',
	],
	permLevel: 5,
	deleteTrigger: false,
};

exports.help = {
	name: 'markov',
	category: 'Fun',
	description: 'Talk to the bot and get replies using Markov chains!',
	usage: 'markov [text]',
	params: {
		'text': 'Message to send to the bot'
	},
	examples: [
		'markov Hello!'
	]
};