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
	const action = args[0];
	const { RichEmbed } = require('discord.js');
	const Chance = require('chance');
	const chance = new Chance();

	let storedWeights = false;

	if (!client.commandData.hasOwnProperty('unbox')) {
		client.commandData.unbox = {
			weights: []
		};
	} else {
		storedWeights = true;
	}

	const unboxConfig = client.config.unbox;
	const qualities = unboxConfig.rarities;
	const rarity_weights = storedWeights ? client.commandData.unbox.weights : unboxConfig.rarity_weights;

	let embed;

	const chosenRarity = chance.weighted(qualities, rarity_weights);
	const color = chosenRarity.color,
		image = `https://static.caprine.net/goatbot_assets/goats/${chosenRarity.file}`,
		weight = rarity_weights[qualities.indexOf(chosenRarity)];

	let prefix = chosenRarity.hasOwnProperty('prefix') ? chosenRarity.prefix : '';
	let suffix = chosenRarity.hasOwnProperty('suffix') ? chosenRarity.suffix : '';

	const name = `${prefix} ${chosenRarity.name} Goat ${suffix}`.trim();

	let weightSum = 0;
	for (let i = 0; i < rarity_weights.length; i++) {
		weightSum += rarity_weights[i];
	}

	/**
	 * Add config rarities to memory if not already in.
	 * We will be using this stored data to decrement a rarity when it is unboxed.
	 */
	if (client.commandData.unbox.weights.length === 0) {
		for (let i = 0; i < rarity_weights.length; i++) {
			const rarity = rarity_weights[i];
			client.commandData.unbox.weights[rarity_weights.indexOf(rarity)] = rarity;
		}
	} else {
		client.commandData.unbox.weights[qualities.indexOf(chosenRarity)] = client.commandData.unbox.weights[qualities.indexOf(chosenRarity)] - 1;
	}

	embed = new RichEmbed()
		.setColor(color)
		.setTitle(`Unbox-A-Goat`)
		.setDescription(`<@${message.author.id}> has unboxed: **${name}!**`)
		.addField('Tier', `_${qualities.indexOf(chosenRarity)}/${(qualities.length - 1)}_`)
		.addField('Drop chance', `_~${((weight / weightSum) * 100).toFixed(3)}%_`)
		.setImage(image)
		.setTimestamp()
	;

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 900,
	aliases: [
		'lootcrate',
		'lootbox'
	],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "unbox",
	category: "Fun",
	description: "Open a loot box",
	usage: "unbox",
	params: {},
	examples: [
		"unbox"
	],
	extra_info: (client, message, args, level) => {
		const unboxConfig = client.config.unbox;
		const qualities = unboxConfig.rarities;
		const rarity_weights = client.commandData.hasOwnProperty('unbox') ? client.commandData.unbox.weights : unboxConfig.rarity_weights;
		let weightSum = 0;
		for (let i = 0; i < rarity_weights.length; i++) {
			weightSum += rarity_weights[i];
		}

		let dropChances = [];
		for (let i = 0; i < qualities.length; i++) {
			dropChances.push(`Tier ${i}/${(qualities.length - 1)}: ${((rarity_weights[i] / weightSum) * 100).toFixed(3)}%`);
		}

		const str = `There are currently ${(qualities.length - 1)} tiers of Goat that you can unbox. The percentage drop chances are listed below by their tier.\n\n${dropChances.join('\n')}`;

		return str;
	}
};