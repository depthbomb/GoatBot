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

const Rcon = require('srcds-rcon');
const { MessageEmbed } = require('discord.js');
const { MissingArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length > 0, 'Please provide a command to send');
	
	const command = args.join(' ');
	const rcon = Rcon({
		address: client.config.tf2.address + ':' + client.config.tf2.port,
		password: client.config.tf2.rcon
	});

	rcon.connect().then(() => {
		return rcon.command(command).then(output => {
			output = output.replace(client.config.tf2.rcon, '[CENSORED]');
			const embed = new MessageEmbed()
				  .setColor(client.colors.brand)
				  .setDescription(`\`\`\`${output}\`\`\``);

			return message.channel.send({ embed });
		});
	}).then(() => rcon.disconnect()).catch(error => {
		console.log(error);
		return message.reply(error);
	});
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 5,
};

exports.help = {
	name: 'rcon',
	category: 'Community',
	description: 'Sends a command via RCON to the TF2 server',
	usage: 'rcon [command]',
	params: {
		'command': 'Command and arguments to send'
	},
	examples: [
		'rcon sm_say hello!'
	]
};