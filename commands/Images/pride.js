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
const dictionary = {
	asexual: 'asexual',
	bi: 'bi',
	bisexual: 'bi',
	gay: 'gay',
	homo: 'gay',
	homosexual: 'gay',
	lesbian: 'lesbian',
	lesbo: 'lesbian',
	pan: 'pan',
	pansexual: 'pan',
	trans: 'trans',
	transexual: 'trans',
	transgender: 'trans',
};
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const opacity = args.length == 2 ? parseFloat(args[1]) : 0.5;

	if (opacity < 0 || opacity > 1) {
		return message.reply('Opacity must be a number between 0 and 1. This means you must use a decimal. For example an opacity of 33% would be 0.33, 100% would be 1, etc.');
	}

	let classification;
	if (dictionary.hasOwnProperty(args[0])) {
		classification = dictionary[args[0]];
	} else {
		return message.reply('Invalid classification.');
	}
	const userAvatar = message.member.user.displayAvatarURL({ format: 'png', size: 512 })
	const avatar = await jimp.read(userAvatar);
	const overlay = await jimp.read(path.join(client.rsrcPath, 'prideflags', 'square', classification + '.png'));
	const tmpName = `pride_${client.uuid()}.${avatar.getExtension()}`;
	const tmpLocation = path.join(client.tmpPath, tmpName);

	overlay.opacity(opacity);
	avatar.composite(overlay, 0, 0);
	avatar.write(tmpLocation, () => {
		message.channel.send({ files: [{ attachment: tmpLocation, name: tmpName }] });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'pride',
	category: 'Images',
	description: 'Overlays a pride flag of your choosing over your profile picture',
	usage: 'pride [classification]',
	params: {
		'classification': 'The classification (orientation/sexuality/gender) flag that you want overlayed onto your profile picture.'
	},
	examples: [
		'pride gay'
	]
};