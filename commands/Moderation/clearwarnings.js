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

const Warning = require('@models/Warning');
const pluralize = require('pluralize');
exports.run = async (client, message, args, level) => {
	if(args.length === 0) return;
	const mention = args.join(' ');

	let member;
	if (mention.match(/<@!?\d{17,19}>/g)) {
		member = message.mentions.members.first();
	} else {
		member = message.guild.members.cache.find(m => m.id === mention);
	}

	if (member) {
		const userId =  member.id;
		Warning.deleteMany({ userId })
		.then(warnings => message.reply(`Cleared ${pluralize('warning', warnings.n, true)} for <@${userId}>.`))
		.catch(err => message.reply(err));
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [
		'clearwarn',
		'warningsclear',
		'wipewarnings'
	],
	permLevel: 2
};

exports.help = {
	name: 'clearwarnings',
	category: 'Moderation',
	description: 'Clears a user\'s outstand warnings',
	usage: 'warn [@mention|user ID]',
	params: {
		'@mention|user ID': 'Mention or ID of user to warn'
	},
	examples: [
		'warn @Username#0000'
	]
};