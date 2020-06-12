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
	let imageUrl;
	if (message.attachments.first()) imageUrl = message.attachments.first().url;
	else if (message.mentions.members.array().length > 0) imageUrl = message.mentions.members.first().user.displayAvatarURL({ format: 'jpg', size: 512 });
	else imageUrl = args.join(' ').trim() || message.member.user.displayAvatarURL({ format: 'jpg', size: 512 });
	if (!imageUrl) return message.reply('Please provide an image source.');

	console.log(imageUrl);

	jimp.read(imageUrl).then(image => {
		const tmpName = `deepfried_${client.uuid()}.${image.getExtension()}`;
		const tmpLocation = path.join(client.tmpPath, tmpName);
		image.quality(1);
		image.posterize(4);
		image.dither565();
		image.write(tmpLocation, () => message.channel.send({ files: [{ attachment: tmpLocation, name: tmpName }] }));
	}).catch(err => message.reply(`There was a problem deepfrying your image. Ensure that the image source you provided is valid.`));
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'deepfry',
	category: 'Images',
	description: '"Deep fries" an image',
	usage: 'deepfry [image]',
	params: {
		'image': 'Direct image URL or image attached to the message that invokes the command, otherwise it will use your avatar'
	},
	examples: [
		'deepfry https://website.com/image.jpg'
	]
};