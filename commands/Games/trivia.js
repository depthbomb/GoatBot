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
const Chance = require('chance'),
	  chance = new Chance();
const { MessageEmbed } = require('discord.js');

const types = {
	multiple: 'Multiple Choice',
	boolean: 'True or False',
};
const choices = ['a', 'b', 'c', 'd'];
const emoji = [ '🇦', '🇧', '🇨', '🇩'];

let inProgress = false;
let sessionToken = '';
let tokenExpires = 0;

exports.run = async (client, message, args, level) => {
	const input = args.join(' ').toLowerCase();
	let difficulty;

	if (!['easy', 'medium', 'med', 'hard'].includes(input) || difficulty === 'med') {
		difficulty = 'medium';
	} else {
		difficulty = input;
	}
	
	if (!sessionToken || tokenExpires <= client.timestamp()) {
		console.log('Token empty or expired, generating a new one...');
		request({
			uri: 'https://opentdb.com/api_token.php?command=request',
			method: 'GET'
		}, (err, res, body) => {
			if (err) throw new Error(err);
			const data = JSON.parse(body);
			sessionToken = data.token;
			tokenExpires = client.timestamp() + 21600;
		});
	}

	if (inProgress) {
		return message.reply('A game is currently in progress. Please wait for it to conclude.');
	} else {
		request({
			uri: `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&encode=url3986&token=${sessionToken}`,
			method: 'GET'
		}, async (err, res, body) => {
			if (err) return client.error(err);
			const data = JSON.parse(body);
			const result        = data.results[0];
			const category      = decodeURIComponent(result.category);
			const type          = types[result.type];
			const question      = decodeURIComponent(result.question);
			const correctAnswer = result.correct_answer;
			let answers         = [...result.incorrect_answers];
				answers.push(result.correct_answer);

			if (result.type === 'multiple') answers = chance.shuffle(answers);
			answers             = answers.map(a => decodeURIComponent(a));

			inProgress = true;

			let embed = new MessageEmbed()
				  .setColor(client.colors.brand)
				  .setTitle(`Trivia! (${category} - ${type})`)
				  .setDescription('You have 15 seconds to answer the following question:')
				  .addField('Question', question)
				  .setFooter('Type the letter of the answer you want to submit');

			let answerDisplay = [];
			let letterIndex = 0
			for (let answer of answers) {
				answerDisplay.push(`${emoji[letterIndex]} ${answer}`)
				letterIndex++;
			}
			
			embed.addField('Choices', answerDisplay.join('\n'));

			const correctAnswerIndex = answers.indexOf(decodeURIComponent(correctAnswer));
			const correctAnswerLetter = choices[correctAnswerIndex];
			const participants = [];
			const winners = [];
			const msg = await message.channel.send({ embed });

			const filter = m => choices.includes(m.content.trim().toLowerCase());
			const collector = message.channel.createMessageCollector(filter, { max: 50, time: 18*1000, errors: ['time'] });
			collector.on('collect', m => {
				const userId = m.author.id;
				const userAnswer = m.cleanContent.trim().toLowerCase();
				if (!participants.includes(userId)) {
					if (userAnswer === correctAnswerLetter) {
						winners.push(userId);
					}
					participants.push(userId);
					m.delete();
				}
			});
			collector.on('end', collected => {
				inProgress = false;
				embed = new MessageEmbed()
					.setTitle('Time\'s Up!')
					.setTimestamp();
				
				if (participants.length > 0) {
					embed
						.setColor(client.colors.green)
						.setDescription(question)
						.addField('Correct Answer', `**${decodeURIComponent(correctAnswer)}**`);

					if (winners.length > 0) {
						const winnerMentions = [];
						
						for (let winner of winners) {
							winnerMentions.push(`<@${winner}>`);
						}

						embed.addField('Winners', winnerMentions.join('\n'));
					} else {
						embed.addField('Winners', 'Nobody!');
					}
				} else {
					embed.setColor(client.colors.red).setDescription('Nobody participated 😢');
				}

				return message.channel.send({ embed });
			});
		});
	}
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'opentrivia',
	],
	permLevel: 0
};

exports.help = {
	name: 'trivia',
	category: 'Games',
	description: 'Ask a trivia question in the current channel, users vote by typing the letter of the answer they want to submit',
	usage: 'trivia [difficulty?]',
	params: {
		'difficulty': '(Optional) Easy, Medium/Med (default) or Hard'
	},
	examples: [
		'trivia',
		'trivia hard'
	]
};