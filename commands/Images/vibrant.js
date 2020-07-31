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

const path = require('path');
const Jimp = require('jimp');
const Vibrant = require('node-vibrant');
const { InvalidArgumentsError } = require('@errors');
const componentToHex = (c) => {
	const hex = Math.floor(c).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
const rgbToHex = (r, g, b) => "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
exports.run = async (client, message, args, level) => {
	let imageUrl;
	if (message.attachments.first()) imageUrl = message.attachments.first().url;
	else if (message.mentions.members.array().length > 0) imageUrl = message.mentions.members.first().user.displayAvatarURL({ format: 'jpg', size: 512 });
	else imageUrl = args.join(' ').trim() || message.member.user.displayAvatarURL({ format: 'jpg', size: 512 });

	InvalidArgumentsError.assert(imageUrl, 'Please provide an image source.');

	Vibrant.from(imageUrl).getPalette((err, palette) => {
		if (typeof palette === 'undefined') return message.reply('The image source you provided is invalid.\nIf you are using a URL, make sure it is a __direct link__ to the image and not to a page displaying the image.\nIf you are attaching an image to the command message, make sure the attachment is an image and/or that the image is the first attachment.');
		const colors = {};
		for (let p in palette) {
			const swatch = palette[p];
			const hexColor = rgbToHex(swatch.rgb[0], swatch.rgb[1], swatch.rgb[2]);
			colors[hexColor] = new Jimp(600, 100, hexColor, (err, image) => {
				if (err) throw new Error(err);
			});
		}
		
		new Jimp(600, 600, 0x0, (err, image) => {
			const tmpName = `vibrant_${client.uuid()}.png`;
			const tmpPath = path.join(client.tmpPath, tmpName);
			let yOffset = 0;
			for (let color of Object.keys(colors)) {
				const instance = colors[color];
				image.blit(instance, 0, yOffset);
				yOffset = yOffset + 100;
			}
			image.write(tmpPath, () => {
				message.channel.send(`Colors in order of appearance: \`\`\`${Object.keys(colors).join('\n')}\`\`\``, {
					files: [
						{ attachment: tmpPath, name: tmpName }
					]
				});
			});
		});
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'vibrance'
	],
	permLevel: 0,
};

exports.help = {
	name: 'vibrant',
	category: 'Images',
	description: 'Extracts prominent colors from an image',
	usage: 'vibrant [image]',
	params: {
		'image': 'Direct image URL or image attached to the message that invokes the command, otherwise it will use your avatar'
	},
	examples: [
		'vibrant https://website.com/image.jpg'
	]
};