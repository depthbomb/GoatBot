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
	if (!args) return;
	const Chance = require('chance');
	const chance = new Chance();
	let validMoves = ["rock", "paper", "scissors"];
	const botMoves = chance.weighted([["rock", "paper", "scissors"], ["rock", "paper", "scissors", "goat"]], [1, 10]);
	const move = args[0].toLowerCase();
	const user = `<@${message.author.id}>`;
	const bot = `<@${client.user.id}>`;
	
	if (message.author.id === client.config.ownerId) validMoves.push('goat');

	const emoji = {
		rock: "✊",
		paper: "✋",
		scissors: "✌️",
		goat: "🐐"
	};

	if (validMoves.includes(move)) {
		let botMove = botMoves.shuffle()[0];
		let outcomeMessage;
		let vsMessage = `${user} ${emoji[move]} _vs._ ${emoji[botMove]} ${bot}`;

		if ((move === "rock" && botMove === "rock") ||
			(move === "paper" && botMove === "paper") ||
			(move === "scissors" && botMove === "scissors")) outcomeMessage = `It's a tie, we are both losers!`;

		if ((move === "rock" && botMove === "scissors") ||
			(move === "paper" && botMove === "rock") ||
			(move === "scissors" && botMove === "paper")) outcomeMessage = `${user}'s ${move} beats ${bot}'s ${botMove}!`;

		if ((botMove === "rock" && move === "scissors") ||
			(botMove === "paper" && move === "rock") ||
			(botMove === "scissors" && move === "paper")) outcomeMessage = `${bot}'s ${botMove} beats ${user}'s ${move}!`;

		if (move === "goat") outcomeMessage = `${user}'s ${move} beats ${bot}'s ${botMove}!`;
		if (botMove === "goat") outcomeMessage = `${bot}'s ${botMove} beats ${user}'s ${move}!`;

		return message.channel.send(`${vsMessage}\n\n${outcomeMessage}`);
	} else {
		return message.reply('Invalid move');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 5,
	aliases: [
		'rockpaperscissors'
	],
	permLevel: 0
};

exports.help = {
	name: "rps",
	category: "Fun",
	description: "Play Rock, Paper, Scissors against a bot.",
	usage: "rps [move]",
	params: {
		"move": "Your move, either Rock, Paper, or Scissors"
	},
	examples: [
		"rps paper"
	]
};