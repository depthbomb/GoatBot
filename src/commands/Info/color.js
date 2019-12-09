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
	if (!args || args.length !== 1) return;

	const color = args[0];
	const fs = require('fs');
	const jimp = require('jimp');
	const imgur = require('imgur');
	const { RichEmbed } = require('discord.js');
	const imageName = `${client.tmpPath}/color_${client.uuid()}.png`;

	if (!color.match(/#?[a-fA-F0-9]{6}/i)) return client.msg(message, "red", "error", "The color code you provided is invalid.");

	let msg = await message.channel.send("Generating image, please wait...");

	const colorCode = color.replace(/^#/, '');

	let image = new jimp(1280, 720, parseInt("0x" + colorCode.toUpperCase() + "FF", 16), (err, img) => {
		if (err) throw new Error(err);

		img.write(imageName, () => {
			imgur.setCredentials(
				client.config.imgur.username,
				client.config.imgur.password,
				client.config.imgur.client
			);
			msg.edit("Almost done...");
			imgur.uploadFile(imageName, 'yalU7').then((json) => {
				let imageURL = json.data.link;
				let colorEmbed = new RichEmbed()
					.setDescription(`Color preview for \`#${colorCode} (0x${colorCode.toUpperCase()}FF)\``)
					.setColor(`#${colorCode}`)
					.setImage(imageURL);
				return msg.edit(`<@${message.author.id}>`, {embed: colorEmbed}).then(() => {
					fs.unlinkSync(imageName);
				});
			});
		});
	});
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "color",
	category: "Info",
	description: "Input a color code and see a preview",
	usage: "color [code]",
	params: {
		"code": "Full hexadecimal color code, # is optional"
	},
	examples: [
		"color #ff69b4",
		"color ff00ff"
	]
};