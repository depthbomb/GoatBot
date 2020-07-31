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

const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { InvalidArgumentsError } = require('@errors');
exports.run = async (client, message, args, level) => {
	const lockdowns = client.store.lockdowns;
	const expires  = args[0].parseTimeFormat() || null;

	InvalidArgumentsError.assert(expires, 'Time format is invalid.');

	const reason = args.slice(1).join(' ') || null;
	const channelId = message.channel.id;

	if (lockdowns.hasOwnProperty(channelId)) return message.reply('This channel is already under a lockdown.');
	lockdowns[channelId] = expires;
	const embed = new MessageEmbed()
		  .setTimestamp()
		  .setColor(client.colors.red)
		  .setTitle('Channel on lockdown')
		  .setDescription(`This channel has been put on lockdown by ${message.member.displayName}.\nMessages sent by non-staff will be automatically deleted until the lockdown has been lifted.`)
		  .addField('Expires', moment.unix(expires).fromNow(true));

	if (reason) embed.addField('Reason', reason);

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 3,
};

exports.help = {
	name: 'lockdown',
	category: 'Moderation',
	description: 'Locks down the channel, preventing messages from non-staff',
	usage: 'lockdown [duration] [reason?]',
	params: {
		'duration': 'Short time format duration of the lockdown',
		'reason': '(Optional) Reason for the lockdown',
	},
	examples: [
		'lockdown 1h',
		'lockdown 5m behave!',
	]
};