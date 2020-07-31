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
exports.run = async (client, message, args, level) => {
	if (message.channel.id !== '481201307257012262') return;
	const kenneled = message.member.guild.roles.cache.find(r => r.name === 'Kenneled');

	if (kenneled) {
		const hasEscaped = chance.weighted([1, 0], [1, 10]);
		if (hasEscaped) {
			message.reply('You have successfully escaped the kennel and are on your way back to the public. Try to behave next time and you might not be back! (You will be freed shortly)');
			client.setTimeout(() => {
				message.member.edit({ mute: false, deaf: false }, 'User escaped kennel');
				return message.member.removeRole(kenneled, 'User escaped!');
			}, (10*1000));
		} else {
			message.reply('Drats! You\'ve failed to escape the kennel. Please try again shortly.');
		}
	}
};

exports.conf = {
	enabled: true,
	cooldown: 185,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'escape',
	category: 'Moderation',
	description: 'Attempt to escape the kennel channel.',
	usage: 'escape',
	params: {},
	examples: [
		'escape'
	]
};