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

const Chance = require('chance')
	  chance = new Chance();
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const roll = chance.integer({ min: 1, max: 6 });
	const image = client.images.dice[roll];
	const embed = new MessageEmbed()
		  .setColor(client.colors.brand)
		  .setDescription(`${message.member.displayName} rolls the dice!`)
		  .setImage(image);

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	aliases: [
		'roll'
	],
	permLevel: 0
};

exports.help = {
	name: 'dice',
	category: 'Random',
	description: 'Rolls a 6-sided dice',
	usage: 'dice',
	params: {},
	examples: [
		'dice',
	]
};