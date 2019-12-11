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

const request = require('request');
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const text = encodeURIComponent(args.join(''));
	const apiUrl = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${client.config.apiKeys.perspective}`;

	let msg = await message.channel.send('Analyzing...');
	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: apiUrl,
		method: 'POST',
		json: {
			comment: { text },
			languages: ['en'],
			requestedAttributes: {
				TOXICITY: {},
				SEVERE_TOXICITY: {},
				IDENTITY_ATTACK: {},
				INSULT: {},
				PROFANITY: {},
				THREAT: {},
				SEXUALLY_EXPLICIT: {},
				FLIRTATION: {},
				INCOHERENT: {},
				INFLAMMATORY: {},
				OBSCENE: {},
				SPAM: {},
			}
		}
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = body;
		const TOXICITY = Math.round(data.attributeScores.TOXICITY.summaryScore.value*100);
		const SEVERE_TOXICITY = Math.round(data.attributeScores.SEVERE_TOXICITY.summaryScore.value*100);
		const IDENTITY_ATTACK = Math.round(data.attributeScores.IDENTITY_ATTACK.summaryScore.value*100);
		const INSULT = Math.round(data.attributeScores.INSULT.summaryScore.value*100);
		const PROFANITY = Math.round(data.attributeScores.PROFANITY.summaryScore.value*100);
		const THREAT = Math.round(data.attributeScores.THREAT.summaryScore.value*100);
		const SEXUALLY_EXPLICIT = Math.round(data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value*100);
		const FLIRTATION = Math.round(data.attributeScores.FLIRTATION.summaryScore.value*100);
		const INCOHERENT = Math.round(data.attributeScores.INCOHERENT.summaryScore.value*100);
		const INFLAMMATORY = Math.round(data.attributeScores.INFLAMMATORY.summaryScore.value*100);
		const OBSCENE = Math.round(data.attributeScores.OBSCENE.summaryScore.value*100);
		const SPAM = Math.round(data.attributeScores.SPAM.summaryScore.value*100);
		const embed = new RichEmbed()
			  .setTitle('Analysis')
			  .setColor(client.colors.brand)
			  .setDescription('Values of >=70% are likely intent.\nFields marked with a **\*** are experimental and may not be accurate.')
			  .addField('Toxicity', `${TOXICITY}%`, true)
			  .addField('Severe Toxicity', `${SEVERE_TOXICITY}%`, true)
			  .addField('Attacking Identity', `${IDENTITY_ATTACK}%`, true)
			  .addField('Insult', `${INSULT}%`, true)
			  .addField('Profanity', `${PROFANITY}%`, true)
			  .addField('Threat', `${THREAT}%`, true)
			  .addField('Sexually Explicit', `${SEXUALLY_EXPLICIT}%`, true)
			  .addField('Flirtation', `${FLIRTATION}%`, true)
			  .addField('Incoherency*', `${INCOHERENT}%`, true)
			  .addField('Inflammatory*', `${INFLAMMATORY}%`, true)
			  .addField('Obscenity*', `${OBSCENE}%`, true)
			  .addField('Spam*', `${SPAM}%`, true)

		return msg.edit({ embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'analyze',
		'toxicity',
		'toxic',
		'pers'
	],
	permLevel: 0,
};

exports.help = {
	name: 'perspective',
	category: 'Info',
	description: 'Analyzes text and displays various attributes about it',
	usage: 'perspective [text]',
	params: {
		'text': 'Text to analyze'
	},
	examples: [
		'perspective You suck',
		'perspective You are cute'
	]
};