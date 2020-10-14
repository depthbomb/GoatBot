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
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;

	unboxTiers = client.config.unbox.tiers;
	unboxWeights = client.config.unbox.weights;

	let weightSum = 0;
	for (let w of unboxWeights) weightSum += w;

	const chosen     = chance.weighted(unboxTiers, unboxWeights),
		  color      = chosen.color,
		  image      = client.images.unbox[chosen.file],
		  weight     = unboxWeights[unboxTiers.indexOf(chosen)],
		  prefix     = chosen.prefix || '',
		  suffix     = chosen.suffix || '',
		  name       = chosen.name || '',
		  fullName   = `${prefix} ${name} Goat ${suffix}`.trim(),
		  tier       = unboxTiers.indexOf(chosen),
		  tiers      = (unboxTiers.length - 1),
		  dropChance = ((weight / weightSum) * 100).toFixed(2);

	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(`Unbox a Goat`)
		.setDescription(`<@${userId}> has unboxed: **${fullName}!**\nType \`${client.printCmd('unboxstats')}\` to view your stats.`)
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