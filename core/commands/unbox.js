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
	const action = args[0];
	const u = message.author;
	const uri = `https://unbox.caprine.net/api/unbox_discord?id=${u.id}&username=${u.username}&avatar=${u.avatar}&discriminator=${u.discriminator}`;
	const request = require('request');
	const { RichEmbed } = require('discord.js');

	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: uri,
		method: 'POST'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const resp = JSON.parse(body);
		const data = resp.results;
		if (resp.success) {
			const name = data.goat.name;
			const color = data.goat.color;
			const file = data.goat.file;
			const value = data.goat.value;
			const tier = data.tier;
			const tiers = data.tiers;
			const chance = data.chance;

			let embed;

			embed = new RichEmbed()
				.setColor(color)
				.setTitle(`Unbox a Goat`)
				.setDescription(`<@${message.author.id}> has unboxed: **${name}!**`)
				.addField('Tier', `_${tier}/${tiers}_`)
				.addField('Value', `_${value} points_`)
				.addField('Drop chance', `_~${chance}_`)
				.setImage(file)
				.setTimestamp()
			;
			return message.channel.send({ embed });
		} else {
			return message.reply(resp.message);
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
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