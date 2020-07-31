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
const jimp = require('jimp');
const { MissingArgumentsError, InvalidArgumentError } = require('@errors');

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
	MissingArgumentsError.assert(args.length !== 0, 'Please supply a classification');
	InvalidArgumentError.assert(dictionary.hasOwnProperty(args[0]), 'The classification you provided is invalid');

	const classification = dictionary[args[0]];
	const opacity = args.length === 2 ? parseFloat(args[1]) : 0.5;

	InvalidArgumentError.assert((opacity >= 0 && opacity <= 1), 'Opacity must be a number between 0 and 1');

	const userAvatar = message.member.user.displayAvatarURL({ format: 'png', size: 512 });
	const avatar = await jimp.read(userAvatar);
	const avatarWidth = avatar.bitmap.width;
	const avatarHeight = avatar.bitmap.height;
	const overlay = await jimp.read(path.join(client.rsrcPath, 'prideflags', 'square', classification + '.png'));
	const tmpName = `pride_${client.uuid()}.${avatar.getExtension()}`;
	const tmpLocation = path.join(client.tmpPath, tmpName);

	overlay.resize(avatarWidth, avatarHeight);
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