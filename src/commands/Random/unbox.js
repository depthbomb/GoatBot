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

exports.run = async (client, message, args, level) => {
	const request = require('request');
	const { RichEmbed } = require('discord.js');
	//https://caprine.s3.amazonaws.com/bot/goats/{}.jpg
	const zalgo = "C̡͓̩̞̬̞͇̱̫̿͌̽̓͗̎̚ọ̧̗̮̰̟͙̠̫ͧ͡r̵̬̟̼̟̪̾͛͝r̰̈̀͗͆̏͘͝͡ṳ̡̫̥̹̟͓̯̟ͨͫ̐̅̀p̍ͩ̿ͯ̎͗ͣ̕͏̧̦̳t̠̲̤̣̼͈̄̑͜e̡̮̥̝̗̱͐̓̿͑͆̚ͅd͎̫̏̈́͋ͪ̓̓́";
	const zalgo2 = "ǫ̹̜̖͉͇́ͤͯf̰͙̤̆̈̈́͜ ̹̗̯̩̺̂͛̅͋ͦͦ͌̎t͐͗̚҉̡̤͕̬̗̩͡h̘͍͍̱̉ͤ͑͛͋͜ě̙̞̖̬͔̩̥̱͍̐ͯ̄̆̈͜ ̸̰̺̬̹̤̙̬̐ͭ́ͅͅB̛̛̹̪ͯ̇͐̍̈́̆̂l̥͓̮ͪ͊ͮ̍ͬͥ̎̽͢a̤̟̘̻̒̓c̵̡̖̦ͯ̓͟k̵̖̼̳̫̊ͤ͐̓̇̓̀ͨ ̷̸̮̼͔ͨ̓͐̆ͨ̈́͞E͛̽͏̢͏͇͉͕̞̬̩͓m͓͖̦͋̿̍͡͝p̛̦͎̻̯̟̫̺ͤ͛͑́ͣ̊ͮ͘i̝͛̿ͧͪ̄̔̅̀r͕͇̹̬̥̘̗̍ͪ̿͆͐̊̀͢ͅě̘̬͚͜͢͝";
	const rarities = [
		{ prefix: 'Unfortunate', name: 'Poor', color: '#837546', file: 'poor' },
		{ name: 'Common', color: '#9d9d9d', file: 'common' },
		{ name: 'Uncommon', color: '#10883e', file: 'uncommon' },
		{ name: 'Rare', color: '#0078d7', file: 'rare' },
		{ name: 'Epic', color: '#881898', file: 'epic' },
		{ name: 'Legendary', color: '#f7630d', file: 'legendary' },
		{ name: 'Fire', color: '#ff8b00', file: 'fire' },
		{ name: 'Aqua', color: '#01b7c4', file: 'water' },
		{ name: 'Snow', color: '#ffffff', file: 'snow' },
		{ prefix: 'Corrupting', name: 'Void', color: '#9b008a', file: 'void' },
		{ name: 'Solar', color: '#ffb901', file: 'solar' },
		{ name: 'Nebular', color: '#e3008d', file: 'nebular' },
		{ prefix: 'Exceedingly Rare', name: 'Omniscient', color: '#0d0d0d', file: 'omniscient' },
		{ prefix: 'Flamboyantly Rare', name: 'Gay', color: '#e81123', file: 'gay' },
		{ name: zalgo, suffix: zalgo2, color: '#2d193b', file: 'old_god' },
	];
	const weights = [

	];

	const embed = new RichEmbed()
		.setColor(color)
		.setTitle(`Unbox a Goat`)
		.setDescription(`<@${message.author.id}> has unboxed: **${name}!**`)
		.addField('Tier', `_${tier}/${tiers}_`)
		.addField('Drop chance', `_~${chance}_`)
		.setImage(file)
		.setTimestamp()
	;
	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
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
	]
};