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

const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const lockdowns = client.store.lockdowns;
	const channelId = message.channel.id;

	if (lockdowns.hasOwnProperty(channelId)) {
		delete lockdowns[channelId];
		const embed = new RichEmbed()
			  .setTimestamp()
			  .setColor(client.colors.green)
			  .setTitle('Lockdown lifted')
			  .setDescription(`This channel has had its lockdown lifted by ${message.member.displayName}.`);
	
		return message.channel.send({ embed });
	} else {
		return message.reply('This channel has no active lockdown.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: 'clearlockdown',
	category: 'Moderation',
	description: 'Removes an active lockdown on the current channel',
	usage: 'clearlockdown',
	params: {},
	examples: [
		'clearlockdown'
	]
};