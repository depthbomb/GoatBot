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

	let statusMessage = await message.channel.send('One moment...');

	const timeOut = setTimeout(() => {
		return statusMessage.edit(`<@${message.author.id}>, Timed out while querying server. Is it up?`);
	}, (10*1000));

	if (action === 'players') {
		ssq.players(serverIp, serverPort, (err, data) => {
			if (err) return client.error(message, err);
			if (data.length < 1) {
				clearTimeout(timeOut);
				return statusMessage.edit(`<@${message.author.id}>, There are currently no players on the server.`);
			}

			const players = data.sort(sortByKey('score', 'desc'));

			const table = new AsciiTable(`${players.length}/32 players `);
			table.setHeading('Name', 'Score', 'Time')

			players.forEach(user => {
				table.addRow(user.name !== '' ? user.name : '<Connecting...>', user.score, `${ms(Math.floor(user.duration * 1000), {long: true})}`);
			});
			
			clearTimeout(timeOut);
	
			return statusMessage.edit(`<@${message.author.id}>\n\`\`\`${table.toString()}\`\`\``);
		});
	} else {
		ssq.info(serverIp, serverPort, (err, data) => {
			if (err) return client.error(message, err);
	
			const serverInfoEmbed = new RichEmbed()
				.setAuthor('Cyan.TF Server Info', 'https://cyan.tf/styles/cyan/images/cyan2018.png', 'https://cyan.tf/')
				.setColor('#0097a7')
				.setFooter(`${serverIp}:${serverPort}`)
				.setTimestamp()
				.addField('Map', data.map, true)
				.addField('Players', `${data.numplayers}/${data.maxplayers}`, true)
				.addField('\u200B', 'Type `!gameinfo players` to get a list of online players.');
	
			clearTimeout(timeOut);

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
	cooldown: 5,
	globalCd: true,
	aliases: [
		"gi"
	],
	permLevel: 0,
	deleteTrigger: true,
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