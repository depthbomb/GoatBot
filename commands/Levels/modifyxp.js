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

const LevelProfile = require('@models/LevelProfile');
const { InvalidArgumentError, InvalidArgumentCountError } = require('@core/errors');
exports.run = async (client, message, args, level) => {
	InvalidArgumentCountError.assert(args.length === 2, 'You must provide two arguments');
	
	let mention = args[0], member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.cache.find(m => m.id == mention);
	}

	if (member) {
		const value = parseInt(args[1]);
		
		InvalidArgumentError.assert(value !== NaN, 'XP value must be a number');

		LevelProfile.findOne({ userId: member.id }, (err, profile) => {
			if (profile) {
				const xp    = profile.value;
				const newXp = xp + value;
				LevelProfile.updateOne({ userId: member.id }, { value: newXp }, (err, res) => {
					if (err) return client.error(message, err);
					return client.msg(message, 'green', 'success', `${member.displayName}'s XP has been modified: \`${xp} -> ${newXp}\``);
				});
			} else {
				LevelProfile.create({ userId: member.id, value, touchAgain: client.timestamp() }, (err, newProfile) => {
					if (err) return client.error(message, err);
					return client.msg(message, 'green', 'success', `${member.displayName}'s level profile has been created and they have been given \`${value}xp\``);
				});
			}
		});
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'modxp'
	],
	permLevel: 5,
};

exports.help = {
	name: 'modifyxp',
	category: 'Levels',
	description: 'Modifies a user\'s XP value',
	usage: 'modifyxp [@mention] [value]',
	params: {
		'@mention': 'Mention of user to target',
		'value': 'Amount of XP to apply to the user, can be negative to subtract XP',
	},
	examples: [
		'modifyxp @Username#0000 50',
		'modifyxp @Username#0000 -600',
	]
};