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

	let msg = await message.author.send("One moment please...");

	let direction = args[0];
	let text = args.slice(1).join(" ");
	let baseImage;
	let yCoord;
	let maxLetters = 150;

	if (text.length > 150 || text.length < 5) return msg.edit("Message must be between 5 and 150 characters long.");

	if (direction === "up") {
		yCoord = 72;
		baseImage = `${client.appPath}/resources/img/koza_accuse_up.png`;
	} else {
		yCoord = 10;
		baseImage = `${client.appPath}/resources/img/koza_accuse_down.png`;
	}

	if (message.channel.type !== "dm") {
		message.delete();
	}

	const fs = require('fs');
	const jimp = require('jimp');
	const imgur = require('imgur');
	const imageName = `${client.tmpPath}/${client.cuid()}.png`;

	jimp.read(baseImage, (err, img) => {
		if (err) return msg.edit(err);

		jimp.loadFont(`${client.appPath}/resources/fonts/impact.fnt`).then ((font) => {
			img.print(font, 10, yCoord, text, 380);

			img.write(imageName, () => {
				imgur.setCredentials(client.config.imgur.username, client.config.imgur.password, client.config.imgur.client);
				imgur.uploadFile(imageName, 'yalU7').then((json) => {
					msg.edit(`<@${message.author.id}>, here is your image, save it or copy the URL somewhere for use later! ${json.data.link}`);
					fs.unlinkSync(imageName);
				});
			});
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"acc"
	],
	cooldown: 10,
	permLevel: 0
};

exports.help = {
	name: "accuse",
	category: "Fun",
	description: "Generates an 'accusation' image",
	usage: "accuse [direction] [text]",
	params: {
		"direction": "Direction in which to point",
		"text": "Text in the image"
	},
	examples: [
		"accuse up This user is a Skeleton, avoid them at all cost"
	]
};