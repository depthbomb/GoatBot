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

const ssq = require('ssq');
const truncate = require('truncate');
const { RichEmbed } = require('discord.js');
const AsciiTable = require('ascii-table');
const ms = require('ms');
exports.run = async (client, message, args, level) => {
	const action = args[0];
	const serverIp = '66.150.188.17';
	const serverPort = 27015;

	let hasPlayers;

	let statusMessage = await message.channel.send('One moment...');
	let tableString;
	let serverData;

	const timeOut = setTimeout(() => {
		return statusMessage.edit(`<@${message.author.id}>, Timed out while querying server. Is it up?`);
	}, (10*1000));

	ssq.players(serverIp, serverPort, (err, data) => {
		if (err) return client.error(message, err);
		if (data.length < 1) {
			hasPlayers = false;
		} else {
			hasPlayers = true;
			const players = data.sort(sortByKey('score', 'desc'));
			const table = new AsciiTable();
			table.setHeading('Name', 'Score', 'Time')

			players.forEach(user => {
				const username = truncate(user.name.trim(), 27);
				table.addRow(user.name !== '' ? username : '<Connecting...>', user.score, `${ms(Math.floor(user.duration * 1000))}`);
			});

			tableString = `\`\`\`${table.toString()}\`\`\``;
		}

		ssq.info(serverIp, serverPort, (err, data) => {
			if (err) return client.error(message, err);
			const serverInfoEmbed = new RichEmbed()
				.setAuthor('Cyan.TF Server Info', null, 'https://cyan.tf/')
				.setColor('#0097a7')
				.setFooter(`${serverIp}:${serverPort}`)
				.setTimestamp()
				.addField('Map', data.map, true);
	
			if (hasPlayers) {
				serverInfoEmbed.addField(`Players: ${data.numplayers}/${data.maxplayers}`, (tableString.length > 1024 ? 'Too many to show.' : tableString));
			} else {
				serverInfoEmbed.addField('Players', 'None', true)
			}
	
			clearTimeout(timeOut);
	
			return statusMessage.edit(`<@${message.author.id}>`, {
				embed: serverInfoEmbed
			});
		});
	});

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
	};
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	globalCd: true,
	aliases: [
		'gi'
	],
	permLevel: 0,
};

exports.help = {
	name: 'gameinfo',
	category: 'Info',
	description: 'Returns info on the Cyan.TF server',
	usage: 'gameinfo',
	params: {},
	examples: [
		'gameinfo'
	]
};