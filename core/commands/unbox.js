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

	const unboxConfig = client.config.unbox;
	const qualities = unboxConfig.rarities;
	const rarity_weights = unboxConfig.rarity_weights;

	let embed;

	if (action === null || args.length < 1) {
		const Chance = require('chance');
		const chance = new Chance();
		const chosenRarity = chance.weighted(qualities, rarity_weights);
		const name = chosenRarity.name,
			color = chosenRarity.color,
			image = `https://static.caprine.net/goatbot_assets/goats/${chosenRarity.file}?v=1`,
			weight = rarity_weights[qualities.indexOf(chosenRarity)];

		let weightSum = 0;
		for (let i = 0; i < rarity_weights.length; i++) {
			weightSum += rarity_weights[i];
		}

		const percentage = ((weight / weightSum) * 100).toFixed(3);
		embed = new RichEmbed()
			.setColor(color)
			.setTitle(`Unbox-A-Goat`)
			.setDescription(`<@!${message.author.id}> has unboxed: **${name} Goat!**`)
			.addField('Rating', `_${(qualities.indexOf(chosenRarity) + 1)}/${qualities.length}_`)
			.addField('Drop chance', `_~${percentage}%_`)
			.setImage(image)
			.setTimestamp();
	} else if (action === 'help') {

		let weightSum = 0;
		for (let i = 0; i < rarity_weights.length; i++) {
			weightSum += rarity_weights[i];
		}

		let dropChances = [];
		for (let i = 0; i < qualities.length; i++) {
			dropChances.push(`**Rating ${i + 1}/${qualities.length}:** \`${((rarity_weights[i] / weightSum) * 100).toFixed(3)}%\``);
		}

		embed = new RichEmbed()
			.setColor(client.colors.brand)
			.setThumbnail('https://static.caprine.net/goatbot_assets/goats/thumbnail.png?v=1')
			.setTitle('Unbox-A-Goat')
			.setDescription(`There are currently ${qualities.length} rarities of Goat that you can unbox. The percentage drop chances are listed below by their rating.`)
			.addField('Drop chances', dropChances.join('\n'));
	}

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 1200,
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
	usage: "unbox [option?]",
	params: {
		'option': '(Optional) Option argument, currently supports "help"'
	},
	examples: [
		"unbox",
		"unbox help"
	]
};