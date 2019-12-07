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
	const request = require('request');
	const text = encodeURIComponent(args.join(''));
	const apiUrl = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${client.config.apiKeys.perspective}`;

	let msg = await message.channel.send('One moment...');
	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: apiUrl,
		method: 'POST',
		json: { comment: { text }, languages: ['en'], requestedAttributes: {SEVERE_TOXICITY: {}} }
	}, (err, res, body) => {
		if (err) {
			console.log('Error', err);
		} else {
			const data = body;
			const toxicity = Math.round(data.attributeScores.SEVERE_TOXICITY.summaryScore.value*100);
			if (toxicity >= 70) {
				return msg.edit(`Text is likely to be perceived as toxic. (${toxicity}%)`);
			} else if (toxicity >= 40) {
				return msg.edit(`Text _may_ be perceived as toxic. (${toxicity}%)`);
			} else {
				return msg.edit(`Text is unlikely to be perceived as toxic. (${toxicity}%)`);
			}
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"toxic"
	],
	cooldown: 5,
	permLevel: 0,
	deleteTrigger: false,
};

exports.help = {
	name: "toxicity",
	category: "Info",
	description: "Determines toxicity of the provided text",
	usage: "toxicity [text]",
	params: {
		"text": "Text to check toxicity of"
	},
	examples: [
		"toxicity your mom gay"
	]
};