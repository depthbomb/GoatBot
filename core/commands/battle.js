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
	if (args.length !== 1) return;
	const target = args.join(' ');

	if(target.match(/<@!?\d{17,19}>/g)) {
		const { RichEmbed } = require('discord.js');
		const opponent = message.mentions.users.first();

		const eventStrings = [
			'$1 boops $2',
			'$1 punchs $2 in the stomach',
			'$1 stabs $2 with a knife',
			'$1 runs $2 over with a school bus',
			'$1 farts on $2',
			'$1 yiffs $2',
			'$1 slaps $2 across the face with a dead fish',
			'$1 spills soda on $2',
			'$1 chucks a goat at $2',
			'$1 spooks $2',
			'$1 rustles $2\'s jimmies',
			'$1 pushes $2 off of a cliff',
			'$1 ingulfs $2 in flames',
			'$1 feeds $2 some spoiled food',
			'$1 kicks $2 in the balls',
			'$1 glomps $2',
			'$1 makes $2 stub their toe'
		];

		const critDamage = 1.5;
	
		let challengerHp = 100;
		let opponentHp = 100;
	
		let challengerCritChance = 10;
		let opponentCritChance = 10;
	
		move = () => {
	
		};
	
		const numRoll = client.randomInt(0, 100, 1);
	
		if (numRoll < critChance) {
			message.reply('Crit!');
		} else {
			message.reply('Non-crit');
		}

	} else {
		return message.reply('Opponent must be a mention.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		'fight'
	],
	cooldown: 0.5,
	permLevel: 5
};

exports.help = {
	name: "b",
	category: "Fun",
	description: "Battle another user to the death!",
	usage: "battle [opponent]",
	params: {
		"opponent": "User to battle, must be a mention"
	},
	examples: [
		"battle @Username#0000"
	]
};