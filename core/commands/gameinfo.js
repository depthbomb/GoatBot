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
	if (args.length > 1) return;

	const ssq = require('ssq');
	const { RichEmbed } = require('discord.js');
	const AsciiTable = require('ascii-table');
	const ms = require('ms');

	const action = args[0];

	const serverIp = '66.150.188.17';
	const serverPort = 27015;

	if (action === 'players') {
		let statusMessage = await message.channel.send('Checking players...');

		ssq.players(serverIp, serverPort, (err, data) => {
			if (err) throw new Error(err);
			if (data.length < 1) return statusMessage.edit(`<@${message.author.id}>, There are currently no players on the server.`);

			const players = data.sort(sortByKey('score', 'desc'));

			const table = new AsciiTable(`${players.length}/32 players `);
			table.setHeading('Name', 'Score', 'Time')

			players.forEach(user => {
				table.addRow(user.name !== '' ? user.name : '<unconnected>', user.score, `${ms(Math.floor(user.duration * 1000), {long: true})}`);
			});
	
			return statusMessage.edit(`<@${message.author.id}>\n\`\`\`${table.toString()}\`\`\``);
		});
	} else {
		let statusMessage = await message.channel.send('Checking server...');

		ssq.info(serverIp, serverPort, (err, data) => {
			if (err) throw new Error(err);
	
			const serverInfoEmbed = new RichEmbed()
				.setAuthor('Cyan.TF Server Info', 'https://cyan.tf/serverapi/bot/cyan-logo.png', 'https://cyan.tf/')
				.setColor('#0097a7')
				.setFooter(`${serverIp}:${serverPort}`)
				.setTimestamp()
				.addField('Map', data.map, true)
				.addField('Players', `${data.numplayers}/${data.maxplayers}`, true)
				.addField('\u200B', 'Type `!gameinfo players` to get a list of online players.');
	
			return statusMessage.edit(`<@${message.author.id}>`, {
				embed: serverInfoEmbed
			});
		});
	}


	const sortByKey = (key, order = 'asc') => {
		return function (a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				return 0;
			}

			const varA = (typeof a[key] === 'string') ?
				a[key].toUpperCase() : a[key];
			const varB = (typeof b[key] === 'string') ?
				b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return (
				(order == 'desc') ? (comparison * -1) : comparison
			);
		};
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 10,
	globalCd: true,
	aliases: [
		"gi"
	],
	permLevel: 0
};

exports.help = {
	name: "gameinfo",
	category: "Info",
	description: "Returns info on the Cyan.TF server",
	usage: "gameinfo [\"players\"?]",
	params: {
		'"players"': '(Optional) Gets info on current players in the server. Anything else will get info on the server itself.'
	},
	examples: [
		"gameinfo",
		"gi players",
	]
};