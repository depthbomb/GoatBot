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

const Chance = require('chance'),
	  chance = new Chance();
const { MessageEmbed } = require('discord.js');
/* #region zalgo */
const zalgo = "C̡͓̩̞̬̞͇̱̫̿͌̽̓͗̎̚ọ̧̗̮̰̟͙̠̫ͧ͡r̵̬̟̼̟̪̾͛͝r̰̈̀͗͆̏͘͝͡ṳ̡̫̥̹̟͓̯̟ͨͫ̐̅̀p̍ͩ̿ͯ̎͗ͣ̕͏̧̦̳t̠̲̤̣̼͈̄̑͜e̡̮̥̝̗̱͐̓̿͑͆̚ͅd͎̫̏̈́͋ͪ̓̓́";
const zalgo2 = "ǫ̹̜̖͉͇́ͤͯf̰͙̤̆̈̈́͜ ̹̗̯̩̺̂͛̅͋ͦͦ͌̎t͐͗̚҉̡̤͕̬̗̩͡h̘͍͍̱̉ͤ͑͛͋͜ě̙̞̖̬͔̩̥̱͍̐ͯ̄̆̈͜ ̸̰̺̬̹̤̙̬̐ͭ́ͅͅB̛̛̹̪ͯ̇͐̍̈́̆̂l̥͓̮ͪ͊ͮ̍ͬͥ̎̽͢a̤̟̘̻̒̓c̵̡̖̦ͯ̓͟k̵̖̼̳̫̊ͤ͐̓̇̓̀ͨ ̷̸̮̼͔ͨ̓͐̆ͨ̈́͞E͛̽͏̢͏͇͉͕̞̬̩͓m͓͖̦͋̿̍͡͝p̛̦͎̻̯̟̫̺ͤ͛͑́ͣ̊ͮ͘i̝͛̿ͧͪ̄̔̅̀r͕͇̹̬̥̘̗̍ͪ̿͆͐̊̀͢ͅě̘̬͚͜͢͝";
/* #endregion */
const rarities = [
	{ prefix: 'Unfortunate', name: 'Poor', color: '#837546', file: 'poor' },
	{ name: 'Common', color: '#9d9d9d', file: 'common' },
	{ name: 'Uncommon', color: '#10883e', file: 'uncommon' },
	{ name: 'Rare', color: '#0078d7', file: 'rare' },
	{ name: 'Epic', color: '#881898', file: 'epic' },
	{ name: 'Legendary', color: '#f7630d', file: 'legendary' },
	{ name: 'Snow', color: '#ffffff', file: 'snow' },
	{ name: 'Aqua', color: '#01b7c4', file: 'water' },
	{ name: 'Fire', color: '#ff8b00', file: 'fire' },
	{ prefix: 'Corrupting', name: 'Void', color: '#9b008a', file: 'void' },
	{ name: 'Solar', color: '#ffb901', file: 'solar' },
	{ name: 'Nebular', color: '#e3008d', file: 'nebular' },
	{ prefix: 'Exceedingly Rare', name: 'Omniscient', color: '#0d0d0d', file: 'omniscient' },
	{ prefix: 'Flamboyantly Rare', name: 'Gay', color: '#e81123', file: 'gay' },
	{ name: zalgo, suffix: zalgo2, color: '#2d193b', file: 'old_god' },
];
let weights = [
	250,	//	poor
	1500,	//	common
	1200,	//	uncommon
	1000,	//	rare
	700,	//	epic
	500,	//	legendary
	400,	//	snow
	400,	//	aqua
	400,	//	fire
	250,	//	void
	150,	//	solar
	100,	//	nebular
	50,		//	omniscient
	20,		//	gay
	14,		//	old god
];
const weightsBackup = weights.slice();
exports.run = async (client, message, args, level) => {
	let weightSum = 0;
	for (let w of weights) weightSum += w;

	const chosen     = chance.weighted(rarities, weights),
		  color      = chosen.color,
		  image      = `https://f000.backblazeb2.com/file/caprine/bot/goats/${chosen.file}.png`,
		  weight     = weights[rarities.indexOf(chosen)],
		  prefix     = chosen.prefix || '',
		  suffix     = chosen.suffix || '',
		  name       = `${prefix} ${chosen.name} Goat ${suffix}`.trim(),
		  tier       = rarities.indexOf(chosen),
		  tiers      = (rarities.length - 1),
		  dropChance = ((weight / weightSum) * 100).toFixed(2);
	
	weights[weights.indexOf(weight)] = (weight - 1);

	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(`Unbox a Goat`)
		.setDescription(`<@${message.author.id}> has unboxed: **${name}!**`)
		.addField('Tier', `\`${tier}/${tiers}\``)
		.addField('Drop chance', `\`${dropChance}%\``)
		.setImage(image)
		.setTimestamp();

	if (tier == tiers) weights = weightsBackup.slice();

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