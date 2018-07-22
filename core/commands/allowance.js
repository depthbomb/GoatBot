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
	const moment = require('moment');
	const { RichEmbed } = require('discord.js');
	const userId = message.author.id.toString();
	const allowanceConfig = client.config.allowances;

	console.log(client.allowances);

	let userImageAllowance = client.allowances.images[userId];
	let userUrlAllowance = client.allowances.links[userId];

	const embed = new RichEmbed()
		.setColor(client.colors.default)
		.setAuthor(message.member.displayName, message.author.displayAvatarURL)
		.setTimestamp();
	
	if (userImageAllowance != undefined) {
		embed.addField('Image Allowance', `${userImageAllowance.amount}/${allowanceConfig.images}, expires ${moment.unix(userImageAllowance.expires).toNow()}`, true);
	} else {
		embed.setDescription('Your image and URL allowance are both unused!');
	}

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: false,
	guildOnly: false,
	aliases: [],
	cooldown: 0,
	permLevel: 0
};

exports.help = {
	name: "allowance",
	category: "Info",
	description: "Shows your current used up content allowances",
	usage: "allowance",
	params: {},
	examples: [
		"allowance"
	]
};