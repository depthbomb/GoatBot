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
	const { RichEmbed } = require('discord.js');
	const Chance = require('chance');
	const unboxConfig = client.config.unbox;
	const qualities = unboxConfig.rarities;
	const probability = unboxConfig.probability;
	const chance = new Chance();
	const chosenRarity = chance.weighted(qualities, probability);
	const name = chosenRarity.name,
		  color = chosenRarity.color,
		  image = `https://static.caprine.net/goatbot_assets/goats/${chosenRarity.file}?id=${message.author.id}`;
	const embed = new RichEmbed()
		.setColor(color)
		.setTitle(`Goat Unboxed`)
		.setDescription(`<@!${message.author.id}> has unboxed: **${name} Goat!**`)
		.addField('Rating', `_${(qualities.indexOf(chosenRarity) + 1)}/${qualities.length}_`, true)
		.setImage(image)
		.setTimestamp();

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 1500,
	aliases: [
		'lootcrate',
		'lootbox'
	],
	permLevel: 0
};

exports.help = {
	name: "unbox",
	category: "Fun",
	description: "Open a loot box",
	usage: "unbox",
	params: {},
	examples: [
		"unbox"
	]
};