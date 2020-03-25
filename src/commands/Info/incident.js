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

exports.run = async (client, message, args, level) => {
	if (args.length > 0) return;

	const { MessageEmbed } = require('discord.js');
	const request = require('request');
	const apiUrl = "https://discord.statuspage.io/history.json";

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const colors = {
		none: "#3498db",
		minor: "#faa61a",
		major: "#f04747"
	};
	const currentMonth = monthNames[new Date().getMonth()];
	const currentDay = new Date().getDate();
	const dateString = `${currentMonth} ${currentDay}`;

	let statusMessage = await message.channel.send('Contacting API...');

	request({
		headers: {
			"User-Agent": client.config.userAgent
		},
		uri: apiUrl,
		method: 'GET'
	}, (err, res, body) => {
		if (err) {
			statusMessage.delete();
			return client.error(message, err);
		}

		statusMessage.edit('Contacted API, checking for incidents today...');

		const data = JSON.parse(body);
		const months = data.months;
		const latestMonth = months[0];
		const latestIncident = latestMonth.incidents[0];
		const incidentTimestamp = latestIncident.timestamp;

		if (incidentTimestamp.indexOf(dateString) !== -1) {

			statusMessage.edit('Found an incident! Gathering details...');

			const incidentUrl = `https://status.discordapp.com/incidents/${latestIncident.code}.json`;

			request({
				uri: incidentUrl,
				method: 'GET'
			}, (err, res, body) => {

				if (err) {
					statusMessage.delete();
					return client.error(message, err);
				}

				const incident = JSON.parse(body);
				const incidentName = incident.name;
				const incidentStatus = incident.status;
				const incidentUpdates = incident.incident_updates;

				statusMessage.edit('Processing incident data...');

				let statusEmbed = new MessageEmbed()
					.setTitle(incidentName)
					.setURL(incident.shortlink)
					.setColor(colors[incident.impact])
					.setTimestamp();

				for (let i = 0; i < incidentUpdates.length; i++) {
					const update = incidentUpdates[i];

					//	Add space above updates if it is not the first one for a cleaner look
					if (i > 0) statusEmbed.addField('\u200b', '\u200b');

					statusEmbed.addField(update.status.toProperCase(), update.body);
				}

				return statusMessage.edit(`<@${message.author.id}>`, { embed: statusEmbed });
			});
		} else {
			return statusMessage.edit(`<@${message.author.id}>, There are no current incidents to report for today!`);
		}

	});
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	aliases: [
		'incidents',
		'issue',
		'issues'
	],
	permLevel: 0,
};

exports.help = {
	name: 'incident',
	category: 'Info',
	description: 'Looks for a current incident/issue from the Discord status page',
	usage: 'incident',
	params: {},
	examples: [
		'incident'
	]
};