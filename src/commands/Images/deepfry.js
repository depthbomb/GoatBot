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

const path = require('path');
const jimp = require('jimp');
exports.run = async (client, message, args, level) => {
	const imageUrl = args.join(' ').trim() || message.attachments.first().url;
	jimp.read(imageUrl).then(image => {
		const tmpName = `deepfried_${client.uuid()}.${image.getExtension()}`;
		const tmpLocation = path.join(client.tmpPath, tmpName);
		image.quality(1);
		image.posterize(4);
		image.dither565();
		image.write(tmpLocation, () => message.channel.send({ files: [{ attachment: tmpLocation, name: tmpName }] }));
	}).catch(err => message.reply(`There was a problem deepfrying your image: \`\`\`${err}\`\`\``));
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'deepfry',
	category: 'Images',
	description: '"Deep fries" an image',
	usage: 'deepfry [image]',
	params: {
		'image': 'Direct image URL or image attached to the message that invokes the command'
	},
	examples: [
		'deepfry https://website.com/image.jpg'
	]
};