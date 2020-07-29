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

const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const embed = new MessageEmbed()
		  .setDescription('Testing...');

	const msg = await message.channel.send({ embed });

	embed
		.setColor('RANDOM')
		.setDescription(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);

	return msg.edit({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'ping',
	category: 'Info',
	description: 'Get my ping info',
	usage: 'ping',
	examples: [
		'ping'
	]
};