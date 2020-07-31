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

const { MessageEmbed } = require('discord.js');
const LevelProfile = require('@models/LevelProfile');
exports.run = async (client, message, args, level) => {
	LevelProfile.find({ disabled: false }).sort({ 'value': 'desc' }).limit(10).exec((err, profiles) => {
		const embed = new MessageEmbed()
			.setTitle('Top 10 Users')
			.setThumbnail(message.guild.iconURL({ dynamic: true, size: 256 }))
			.setColor(client.colors.yellow);

		for (let i = 0; i < profiles.length; i++) {
			const profile = profiles[i];
			const username = client.users.cache.find(u => u.id == profile.userId);
			embed.addField(`Rank #${i+1} @ ${profile.value}xp`, username);
		}

		return message.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	globalCd: true,
	aliases: [
		'topten',
		'leaderboard2'
	],
	permLevel: 0,
};

exports.help = {
	name: 'top10',
	category: 'Levels',
	description: 'Shows the top 10 ranked users',
	usage: 'top10',
	params: {},
	examples: [
		'top10'
	]
};