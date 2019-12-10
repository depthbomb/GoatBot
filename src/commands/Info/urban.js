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

const trunc = require('truncate');
const request = require('request');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const term = encodeURIComponent(args.join(" "));
	const apiUrl = `http://api.urbandictionary.com/v0/define?term=${term}`;

	let msg = await message.channel.send("Searching...");

	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: apiUrl,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);

		if (data.result_type === "no_results") {
			return msg.edit(`<@${message.author.id}>, I didn't find any results using your search term :(`);
		} else {
			const result = data.list[0];
			const embed = new RichEmbed()
				.setTitle(`Results for \`${decodeURIComponent(term)}\``)
				.setDescription(result.permalink)
				.addField("Definition", trunc(result.definition, 1023))
				.setColor("#134FE6");

			if (result.example) embed.addBlankField(1).addField('Example(s)', trunc(result.example, 500));
			
			return msg.edit(`<@${message.author.id}>`, { embed });
		}
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5.5,
	aliases: [
		"ud",
		"urbandictionary"
	],
	permLevel: 0,
};

exports.help = {
	name: "urban",
	category: "Info",
	description: "Find a definition on Urban Dictionary",
	usage: "urban [term]",
	params: {
		"term": "Term to search for"
	},
	examples: [
		"urban thought itch"
	]
};