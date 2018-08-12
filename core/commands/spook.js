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
	if (args.length !== 1) return;
	const target = args[0];
	const sender = message.author.tag;

	let userTarget;

	if(target.match(/<@!?\d{17,19}>/g)) {
		userTarget = message.mentions.users.first();
	} else {
		try {
			userTarget = client.users.find(u => u.id === target);
		} catch (e) {
			message.author.send("User does not appear to exist.");
		}
	}

	let spookyPics = [
		"https://i.imgur.com/4KD67We.jpg",
		"https://i.imgur.com/nLmJiir.jpg",
		"https://i.imgur.com/yVxx7Hv.jpg",
		"https://i.imgur.com/3BDgmRe.jpg",
		"https://i.imgur.com/PRvZEn7.jpg",
		"https://i.imgur.com/cRgjwb2.jpg",
		"https://i.imgur.com/MWiDknU.jpg"
	];

	userTarget.send(`${spookyPics.shuffle()[0]}\n\n***OoOOooh!***\n_You have been spooked by ${sender}!_\nHappy Halloween!`).then(msg => {
		message.delete();
	}).catch(err => {
		message.author.send(`The target does not appear to allow me to send them DMs. I cannot spook them if I cannot send them DMs.`);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	cooldown: 60,
	permLevel: 5
};

exports.help = {
	name: "spook",
	category: "Fun",
	description: "Happy Halloween",
	usage: "spook [target] [message?]",
	params: {
		"target": "User ID or mention of target you want to spook",
		"message": "(Optional) Message to include along with the spooky message"
	},
	examples: [
		"spook @Username#0000",
		"spook 290188585296986113 get spooked ya loser"
	]
};