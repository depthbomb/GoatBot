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

const request = require('request');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const appId = client.config.openweathermap_api_key;
	const query = args.join(' ');
	const uri = `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appId}&units=imperial`;

	let msg = await message.reply('Sending request...');
	request({
		uri: uri,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return client.error(message, err);
		const data = JSON.parse(body);
		let embed;
		if (data.cod && data.cod === 200) {
			const weather = data.weather[0];
			const icon = `http://openweathermap.org/img/w/${weather.icon}.png`;
			embed = new MessageEmbed()
				.setThumbnail(icon)
				.setTitle(`Weather for ${data.name} (${data.coord.lat},${data.coord.lon})`)
				.setDescription(`**${weather.main}**: ${weather.description}`)
				.addField('Temperature', `**${data.main.temp}F** (high ${data.main.temp_max}, low ${data.main.temp_min})`)
				.addField('Humidity', `**${data.main.humidity}%**`, true)
				.addField('Wind', `~**${data.wind.speed}MPH**`, true)
				.addField('Cloud coverage', `~**${data.clouds.all}%**`, true)
				.addField('Sunrise', moment.unix(data.sys.sunrise).fromNow(), true)
				.addField('Sunset', moment.unix(data.sys.sunset).fromNow(), true)
				.setFooter(`Updated ${moment.unix(data.dt).fromNow()}`);
		} else {
			embed = new MessageEmbed()
				.setTitle(`Error ${data.cod}`)
				.setColor(client.colors.red)
				.setDescription(data.message);
		}

		return msg.edit({ embed });
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'temperature',
		'temp',
	],
	permLevel: 0,
};

exports.help = {
	name: 'weather',
	category: 'Info',
	description: 'Gets weather conditions for the provided location',
	usage: 'weather [location]',
	params: {
		'location': 'Location to get weather info on, see examples'
	},
	examples: [
		'weather Chicago,Illinois',
		'weather London,UK'
	]
};