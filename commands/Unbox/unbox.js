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

const Chance = require('chance'),
	  chance = new Chance();
const Unbox = require('@models/Unbox');
const { MessageEmbed } = require('discord.js');

let unboxTiers;
let unboxWeights;

const images = {
	poor: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861731291146.png',
	common: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648860476932196.png',
	uncommon: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861953589248.png',
	rare: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861743874098.png',
	epic: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861823434752.png',
	legendary: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861471244288.png',
	snow: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648871638106203.png',
	water: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648870606176286.png',
	fire: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648868463149147.png',
	void: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648869389959168.png',
	solar: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648869822103703.png',
	nebular: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648870576816128.png',
	omniscient: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648872422309948.png',
	gay: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648861127049297.png',
	old_god: 'https://cdn.discordapp.com/app-assets/405805435438891008/739648872724299876.png',
};
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;

	unboxTiers = client.config.unbox.tiers;
	unboxWeights = client.config.unbox.weights;

	let weightSum = 0;
	for (let w of unboxWeights) weightSum += w;

	const chosen     = chance.weighted(unboxTiers, unboxWeights),
		  color      = chosen.color,
		  image      = images[chosen.file] + '?size=1024',
		  weight     = unboxWeights[unboxTiers.indexOf(chosen)],
		  prefix     = chosen.prefix || '',
		  suffix     = chosen.suffix || '',
		  name       = `${prefix} ${chosen.name} Goat ${suffix}`.trim(),
		  tier       = unboxTiers.indexOf(chosen),
		  tiers      = (unboxTiers.length - 1),
		  dropChance = ((weight / weightSum) * 100).toFixed(2);

	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(`Unbox a Goat`)
		.setDescription(`<@${userId}> has unboxed: **${name}!**\nType \`${client.printCmd('unboxstats')}\` to view your stats.`)
		.addField('Tier', `\`${tier}/${tiers}\``, true)
		.addField('Drop chance', `\`${dropChance}%\``, true)
		.setImage(image);

	Unbox.findOne({ userId }, (err, doc) => {
		if (err) return console.error(err);
		if (doc === null) {
			Unbox.create({ userId, tiers: [tier] }, (err, res) => {
				if (err) return console.error(err);
			});
		} else {
			Unbox.updateOne({ userId }, { tiers: doc.tiers.concat(tier) }, (err, res) => {
				if (err) return console.error(err);
			});
		}
	});

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 450,
	aliases: [
		'lootcrate',
		'lootbox'
	],
	permLevel: 0,
};

exports.help = {
	name: 'unbox',
	category: 'Random',
	description: 'Open a loot box',
	usage: 'unbox',
	params: {},
	examples: [
		'unbox'
	]
};