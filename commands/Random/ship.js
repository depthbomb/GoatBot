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

const Chance = require('chance');
const crypto = require('crypto');
const { MessageEmbed } = require('discord.js');
const { InvalidArgumentError, InvalidArgumentCountError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	InvalidArgumentCountError.assert(args.length === 2, 'Both arguments are required.');
	let thing = args[0].usToSp().trim();
	let thing2 = args.slice(1).join(' ').trim();

	InvalidArgumentError.assert(thing.toLowerCase() !== thing2.toLowerCase(), 'You cannot ship two identical items.');

	try {
		if (thing.match(/<@!?\d{17,19}>/g)) {
			let user1 = message.mentions.members.first();
			thing = thing.replace(/<@!?\d{17,19}>/ig, user1.displayName);
		}
	
		if (thing2.match(/<@!?\d{17,19}>/g)) {
			let user2 = message.mentions.members.last();
			thing2 = thing2.replace(/<@!?\d{17,19}>/ig, user2.displayName);
		}
	} catch (error) {
		return client.error(message, error);
	}

	const seed = parseInt((parseInt('0x' + crypto.createHash('md5').update(thing).digest("hex")) * parseInt('0x' + crypto.createHash('md5').update(thing2).digest("hex"))).toString().replace('.', ''));
	const chance = new Chance(seed);
	const output = Math.floor(chance.random() * 100) + 1;
	const blocks = Math.floor(output / 10);
	const bar = '█'.repeat(blocks);
	const barFill = ' ​'.repeat((10 - blocks));

	let response;
	if(output >= 0 && output < 10) response = '_Uh oh!_ Maybe you two should see other people';
	else if(output >= 10 && output < 20) response = 'Awful... \:cry:';
	else if(output >= 20 && output < 40) response = 'Not too great \:cry:';
	else if(output >= 40 && output < 50) response = 'Worse than average \:neutral_face:';
	else if(output == 50) response = 'There could be a chance \:neutral_face:';
	else if(output > 50 && output < 75 && output !== 69) response = 'Not bad! \:slight_smile:';
	else if(output === 69) response = '**( ͡° ͜ʖ ͡°)**';
	else if(output >= 75 && output < 90) response = 'Pretty good! \:grinning:';
	else if(output >= 90 && output < 100) response = 'Great! \:kissing_heart:';
	else if(output >= 100) response = 'A perfect match! \:heart_eyes:';
	else response = 'You should not see this';

	const embed = new MessageEmbed()
		.setColor('#be1931')
		.setTitle('\:heart: Ship Calculator')
		.setDescription(`\:small_red_triangle_down: \`${thing}\`\n\:small_red_triangle: \`${thing2}\`\n\n${output}% \`${bar}${barFill}\` ${response}`);

	return message.reply({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'ship',
	category: 'Random',
	description: 'Ship two things together and see how much they belong with eachother!',
	usage: 'ship [thing] [thing2?]',
	params: {
		'thing': 'Thing to ship yourself with, use underscores in place of spaces',
		'thing2': '(Optional) Ships the first thing with this one. No need for underscores as spaces'
	},
	examples: [
		'ship your_mom me',
		'ship @Username#0000'
	]
};