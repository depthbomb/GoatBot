exports.run = (client, message, args, level) => {
	if (message.channel.type === "dm") return message.reply("This game can only be played in a public text channel.");

	const fs = require('fs');
	const ms = require('ms');
	const pokemonArray = require('pokemon').all();

	let timeLimit = 25000;
	let pokemon;
	let pokemon2;
	let scrambled2;
	let hasMultipleAnswers = false;
	let gameInProgress = false;

	if (gameInProgress) return message.reply('A game is currently in progress, please wait for it to finish before starting a new one.');

	gameInProgress = true;

	if (args[0] === "hard") {
		timeLimit = 20000;
		let pokemonFilter = pokemonArray.filter(word => word.length > 7);
		pokemon = pokemonFilter.shuffle()[0];
		pokemon2 = pokemonFilter.shuffle()[0];
		scrambled2 = pokemon2.scramble().toUpperCase();
		scrambled = pokemon.scramble().toUpperCase();
		hasMultipleAnswers = true;
	} else if (args[0] === "medium" || args[0] === "med") {
		timeLimit = 20000;
		let pokemonFilter = pokemonArray.filter(word => word.length <= 6);
		pokemon = pokemonFilter.shuffle()[0];
		scrambled = pokemon.scramble().toLowerCase();
	} else {
		pokemon = pokemonArray.shuffle()[0];
		scrambled = pokemon.scramble();
	}
	
	let startText = `**[Who's that Pokemon?]** <@${message.author.id}> has started a game of _Who's that Pokemon?_ You have ***${ms(timeLimit, {long: true})}*** starting now to guess this Pokemon: \`${scrambled}\``;
	
	if (hasMultipleAnswers) startText = `**[Who's that Pokemon?]** <@${message.author.id}> has started a game of _Who's that Pokemon?_ You have ***${ms(timeLimit, {long: true})}*** starting now to guess these two Pokemon: \`${scrambled}\` and \`${scrambled2}\`. Answer like \`answer1 answer2\` _or_ \`answer2 answer1\``;

	message.channel.send(startText).then(() => {
		message.channel.awaitMessages(response => (response.content.toLowerCase() === pokemon.toLowerCase() || hasMultipleAnswers && (response.content.toLowerCase() === pokemon.toLowerCase() + ' ' + pokemon2.toLowerCase() || response.content.toLowerCase() === pokemon2.toLowerCase() + ' ' + pokemon.toLowerCase())), {
			max: 1,
			time: timeLimit,
			errors: ['time'],
		}).then(collected => {
			let correctText = `**[Who's that Pokemon?]** <@${collected.first().author.id}> has correctly guessed the Pokemon! The answer was \`${pokemon.toProperCase()}\`.`;
			if (hasMultipleAnswers) correctText = `**[Who's that Pokemon?]** <@${collected.first().author.id}> has correctly guessed the Pokemon! The answers are \`${pokemon.toProperCase()}\` and \`${pokemon2.toProperCase()}\`.`;

			message.channel.send(correctText);

			gameInProgress = false;

			fs.unlink(`${client.tmpPath}/cooldowns/c_wtp_GLOBAL.json`, (err) => {
				if (err) client.log("error", "Error removing cooldown: " + err);
				gameInProgress = false;
			});
		}).catch(() => {
			let answerText = `**[Who's that Pokemon?]** _Time is up!_ The correct answer was \`${pokemon.toProperCase()}\``;
			if (hasMultipleAnswers) answerText = `**[Who's that Pokemon?]** _Time is up!_ The correct answers are \`${pokemon.toProperCase()}\` and \`${pokemon2.toProperCase()}\``;
			message.channel.send(answerText);

			gameInProgress = false;

			fs.unlink(`${client.tmpPath}/cooldowns/c_wtp_GLOBAL.json`, (err) => {
				if (err) client.log("error", "Error removing cooldown: " + err);
				gameInProgress = false;
			});
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	cooldown: 25,
	globalCd: true,
	permLevel: 0
};

exports.help = {
	name: "wtp",
	category: "Fun",
	description: "Starts a game of \"Who's that Pokemon?\" in the current channel. Guess the Pokemon from the scrambled name.",
	usage: "wtp [difficulty?]",
	params: {
		"difficulty": "(Optional) Difficulty of the game. Accepts nothing for easy, med/medium, and hard."
	},
	examples: [
		"wtp"
	]
};