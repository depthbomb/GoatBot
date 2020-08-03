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

const request = require('request');
const { MessageEmbed } = require('discord.js');
const { MissingArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert('Please provide a query');
	const query = encodeURIComponent(args.join(' '));
	const uri = `http://api.wolframalpha.com/v2/query?appid=${client.config.apiKeys.wolframalpha}&input=${query}&format=plaintext&output=json&units=nonmetric`;

	let msg = await message.reply('Sending request...');
	request({
		uri: uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body).queryresult;

		let embed = new MessageEmbed()
			.setTitle('Wolfram Alpha')
			.setColor('#ff7e00');

		if (data.success) {
			const pods = data.pods,
				  input = data.pods[0],
				  result = data.pods[1];

			embed.addField(input.title, input.subpods[0].plaintext)
				.addField(result.title, result.subpods[0].plaintext)
				.setFooter(`Timing: ${data.timing}s`);

			if (data.pods[2] && data.pods[2].id === 'UnitConversion') {
				const conversions = data.pods[2];
				const fields = [];
				conversions.subpods.forEach(pod => fields.push(pod.plaintext));
				embed.addField(conversions.title, fields.join('\n'));
			}

			if (data.pods[3] && data.pods[3].id === 'ComparisonAsSpeed') {
				const comparison = data.pods[3];
				const fields = [];
				comparison.subpods.forEach(pod => fields.push(pod.plaintext));
				embed.addField(comparison.title, fields.join('\n'));
			}
		} else {
			if (data.error !== false) {
				if (data.error.code === '1') {
					embed.setColor(client.colors.red)
						.setDescription(`Error #${data.error.code}: Temporary error, please try again shortly.`)
						.setFooter(`Timing: ${data.timing}s`);
				} else {
					embed.setColor(client.colors.red)
						.setDescription(`Error #${data.error.code}: \`${data.error.msg}\``)
						.setFooter(`Timing: ${data.timing}s`);
				}
			} else {
				const dym = data.didyoumeans;
				let dyms = [];
				dym.forEach(d => dyms.push(d.val));
				embed.setColor(client.colors.red)
					.addField('Did you mean...', dyms.join('\n'))
					.setFooter(`Timing: ${data.timing}s`);
			}
		}

		return msg.edit(null, { embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	globalCd: false,
	aliases: [
		'wa'
	],
	permLevel: 0,
};

exports.help = {
	name: 'wolfram',
	category: 'Info',
	description: 'Input a color code and see a preview',
	usage: 'wolfram [query]',
	params: {
		'query': 'Query'
	},
	examples: [
		'wolfwam 4+4',
		'wolfram population of the USA'
	]
};