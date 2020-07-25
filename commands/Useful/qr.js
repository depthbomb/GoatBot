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
const qr = require('qrcode');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const text = args.slice(0).join(' ') || (() => { return });
	const imageName = `${client.uuid()}.png`;
	const imagePath = path.join(client.tmpPath, imageName);
	const options = {
		margin: 2,
		scale: 32,
		color: {
			dark: client.colors.brand,
			light: '#ffffffff'
		}
	};
	let msg = await message.channel.send('Generating...');
	qr.toFile(imagePath, text, options, err => {
		if (err) return msg.edit(err.message);
		msg.delete().then(msg => {
			msg.channel.send({ files: [{ attachment: imagePath, name: imageName }] });
		});
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	globalCd: false,
	aliases: [
		'qrcode'
	],
	permLevel: 0
};

exports.help = {
	name: 'qr',
	category: 'Useful',
	description: 'Generates a QR code image from supplied text',
	usage: 'qr [text]',
	params: {
		'text': 'Text to encode into the QR code'
	},
	examples: [
		'qr hewwo',
	]
};