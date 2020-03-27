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
	if (args.length === 0) return;
	const input = args.join(' ');
	const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^'];
	let output = input
				 .replace(/(?:r|l)/g, 'w')
				 .replace(/(?:R|L)/g, 'W')
				 .replace(/n([aeiou])/g, 'ny$1')
				 .replace(/N([aeiou])/g, 'Ny$1')
				 .replace(/N([AEIOU])/g, 'Ny$1')
				 .replace(/ove/g, 'uv')
				 .replace(/\!+/g, ' ' + faces[Math.floor(Math.random() * faces.length)] + ' ');

	return message.reply(`\`\`\`${output}\`\`\``);
};

exports.conf = {
	enabled: true,
	cooldown: 1.5,
	aliases: [
		'owo',
	],
	permLevel: 0,
};

exports.help = {
	name: 'uwu',
	category: 'Fun',
	description: 'UwU-ify your text',
	usage: 'uwu [input]',
	params: {
		'input': 'Input to UwU-ify'
	},
	examples: [
		'uwu Hello',
	]
};