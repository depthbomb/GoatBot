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
	const sides = ['Heads', 'Tails'];
	const decision = sides.shuffle()[0];
	const image = client.images.coin[decision.toLowerCase()];
	const embed = new MessageEmbed()
		  .setColor('#828282')
		  .setDescription(`The coin lands on __${decision}!__`)
		  .setImage(image);

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'flip'
	],
	permLevel: 0,
};

exports.help = {
	name: 'coin',
	category: 'Random',
	description: 'Flips a coin',
	usage: 'coin',
	params: {},
	examples: [
		'coin',
		'flip'
	]
};