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

const exec = require('execa');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const embed = new MessageEmbed()
		  .setColor(client.colors.red)
		  .setTitle('Pending shutdown')
		  .setDescription('**Warning!** This will stop the bot process via PM2 and it will not be restarted automatically.\n\nClick 🛑 within **10 seconds** to confirm.')
	return message.channel.send({ embed }).then(msg => {
		msg.react('🛑').then(() => {
			const filter = (r, u) => r.emoji.name === '🛑' && u.id === client.config.ownerId;
			const collector = msg.createReactionCollector(filter, { time: 10000 });
				  collector.on('collect', async r => await exec('pm2', ['stop', 'goat']));
				  collector.on('end', c => msg.delete());
		});
	});
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 5,
};

exports.help = {
	name: 'shutdown',
	category: 'Dev',
	description: 'Stops the bot via PM2',
	usage: 'shutdown',
	params: {},
	examples: [
		'shutdown'
	]
};