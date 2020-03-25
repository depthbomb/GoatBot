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

const cooldowns = {};
const Patron = require('@models/Patron');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');
module.exports = (client, message) => {
	const userId         = message.author.id;
	const channelId      = message.channel.id;
	const messageContent = message.content;
	const cleanContent   = message.cleanContent;

	/**
	* Automatically delete messages in refugee camp and kennel after 10 minutes. Placed up at the top so we cover bot messages too.
	*/
	if (channelId === client.config.refugeeChannel || channelId === client.config.kennelChannel)
		setTimeout(() => message.delete(), (600*1000));

	if (message.author.bot || message.system || message.channel.type === 'dm') return;

	const isOwner       = (userId === client.config.ownerId);
	const level         = client.permLevel(message);
	const isServerStaff = (message.member.roles.cache.find(r => r.name === client.config.roles.admin) || message.member.roles.cache.find(r => r.name === client.config.roles.mod) || level > 1 || isOwner);

	let logPrefix = [];
	let username = message.member !== null ? message.member.displayName : message.author.tag;

	if (message.member.guild.available)
		logPrefix.push(`[${message.member.guild.name}]`);

	logPrefix.push(`#${message.channel.name}`);

	if (message.tts) logPrefix.push('[TTS]');

	let isAttachment = false;
	let attachmentWithMessage = false;

	let logMessage;

	if (typeof message.attachments.first() != 'undefined')
		isAttachment = true;
	if (isAttachment && messageContent !== '')
		attachmentWithMessage = true;

	if (isAttachment && !attachmentWithMessage)
		logMessage = `${logPrefix.join(' ')} ${username} uploaded attachment ${message.attachments.first().url}`;
	else if (isAttachment && attachmentWithMessage)
		logMessage = `${logPrefix.join(' ')} ${username} uploaded attachment ${message.attachments.first().url} with message [${cleanContent}]`;
	else
		logMessage = `${logPrefix.join(' ')} ${username}: ${cleanContent}`;

	client.log('msg', logMessage);

	const args    = messageContent.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd     = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (client.store.lockdowns.hasOwnProperty(channelId))
		if (level < 3)
			return message.delete();

	/**
	*	Non-command messages
	*/
	if(messageContent.indexOf(client.config.prefix) !== 0) {
		if (messageContent.includes('discord.gg') || messageContent.includes('invite')) {
			if (
				null !== messageContent.match(/^(https?:\/\/)?discord\.gg(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
				null !== messageContent.match(/^(https?:\/\/)?discord\.gg\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
				null !== messageContent.match(/^(https?:\/\/)?discordapp\.com\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig)
			) {
				if (isServerStaff) return;
				if (
					!messageContent.includes('discord.gg/xw624a8') ||
					!messageContent.includes('discord.gg/invite/xw624a8') ||
					!messageContent.includes('discordapp.com/invite/xw624a8')
				) {
					return message.delete().then(m => m.reply('Discord invite links are not allowed. Please keep those links to DMs.'));
				}
			}
		}

		if (message.guild) {
			const cfg = client.config.store;
			// if (!cfg.excludeChannels.includes(channelId)) {
			// 	const now = client.timestamp();
			// 	const goldCooldown = (client.timestamp() + cfg.cooldown);
			// 	Patron.findOne({ userId }, 'gold earnAgain enabled', (err, patron) => {
			// 		if (err) throw new Error(err);
			// 		if (!patron) {
			// 			Patron.create({ userId, earnAgain: goldCooldown }).catch(err => {
			// 				throw new Error(err);
			// 			});
			// 		} else {
			// 			if (patron.enabled && patron.earnAgain <= now) {
			// 				const pendingGold = client.randomInt(cfg.gold[0], cfg.gold[1]);
			// 				patron.gold = patron.gold + pendingGold;
			// 				patron.earnAgain = goldCooldown;
			// 				patron.save((err, newPatron) => {
			// 					if (err) throw new Error(err);
			// 					console.log(message.member.displayName, 'has earned', pendingGold, 'gold');
			// 				});
			// 			}
			// 		}
			// 	});
			// }
		}

		return;
	}

	// If the command exists, **AND** the user has permission, run it.
	if (cmd) {
		if (
			//	Prevent commands from being used in refugee camp
			channelId === '431266723736322048' ||
			//	Prevent commands from being used outside of guilds
			!message.guild ||
			//	Prevent commands from being used in the Kennel if the command is not !escape and the user is not elevated
			(cmd.help.name !== 'escape' && channelId === '481201307257012262' && level < 3)
		) return;

		if (level >= cmd.conf.permLevel) {
			const cooldown = (cmd.conf.cooldown * 1000) || 1500;
			const cooldownName = cmd.conf.globalCd ? `${cmd.help.name}_GLOBAL` : `${cmd.help.name}_${userId}`;
			const messageTime = message.createdTimestamp;
			const bypassCooldown = userId === client.config.ownerId;

			if (cooldowns.hasOwnProperty(cooldownName)) {
				const expiration = cooldowns[cooldownName].ex;
				const timeLeft   = (expiration - messageTime);
				const response   = timeLeft <= 1000 ? 'Please try again.' : `Please try again in about ${ms(timeLeft, { long: true })}.`;
				const embed = new MessageEmbed()
					  .setColor('#aab8c2')
					  .setDescription(`\:timer: <@${userId}>, ${response}`);

				client.log('system', `${message.author.username} executed command [${cmd.help.name}] but is under a cooldown.`);
				return message.channel.send({ embed });
			} else {
				if (!bypassCooldown) {
					cooldowns[cooldownName] = { ex: (messageTime + cooldown) };
					setTimeout(() => delete cooldowns[cooldownName], cooldown);
				}

				client.log('system', `${message.author.username} executed command [${cmd.help.name}]`);
				return cmd.run(client, message, args, level);
			}
		} else {
			client.log('system', `${message.author.username} attempted to execute command [${cmd.help.name}] but does not have permission`);
			return client.msg(message, 'red', 'error', `You do not have permission to use this command. It requires a permission level of ${cmd.conf.permLevel} and you have a permission level of ${level}.`, true);
		}
	}
};