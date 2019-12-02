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

exports.run = (client, message, args, level) => {
	const bullet = 3;
	const chamber = client.randomInt(1, 6);

	if(bullet === chamber) {
		return message.channel.send(`\:boom:\:gun: ***BANG!!*** <@${message.author.id}> has shot themselves... Press **F** to pay respects.`);
	} else {
		return message.channel.send(`\:gun: _Click_... <@${message.author.id}> pulls the trigger and nothing happens...`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"rr",
		"russianroulette"
	],
	cooldown: 1.5,
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "roulette",
	category: "Fun",
	description: "Play a game of Russian Roulette. Spin the barrel and pull the trigger.",
	usage: "roulette",
	examples: [
		"roulette"
	]
};