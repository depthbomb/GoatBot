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

const cooldowns = {};

const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { xp } = require('@helpers');
const {
	MissingArgumentError,
	InvalidArgumentError,
	InvalidArgumentCountError,
	InsufficientPermissionsError,
	RefugeeCommandUsageError,
	InvalidCommandLocationError,
	GuildOnlyCommandError,
} = require('@errors');
module.exports = async (client, message) => {
	const author         = message.author;
	const userId         = author.id;
	const channelId      = message.channel.id;
	const messageContent = message.content;
	const cleanContent   = message.cleanContent;

	/**
	* Automatically delete messages in refugee camp and kennel after 10 minutes. Placed up at the top so we cover bot messages too.
	*/
	if (channelId === client.config.refugeeChannel || channelId === client.config.kennelChannel) {
		client.setTimeout(() => message.delete(), (600*1000));
	}

	if (message.author.bot || message.system) return;

	const isOwner       = (userId === client.config.ownerId);
	const level         = client.permLevel(message);
	const isServerStaff = (message?.member?.roles.cache.find(r => r.name === client.config.roles.admin) || message?.member?.roles.cache.find(r => r.name === client.config.roles.mod) || level > 1 || isOwner);

	const logPrefixes = [];
	const username = message.member !== null ? message.member.displayName : message.author.tag;

	if (message?.member?.guild) {
		logPrefixes.push(`[${message.member.guild.name}]`, `#${message.channel.name}`);
	} else {
		logPrefixes.push('[DM]');
	}

	if (message.tts) {
		logPrefixes.push('[TTS]');
	}

	const logPrefix = logPrefixes.join(' ');
	const isAttachment = (typeof message.attachments.first() != 'undefined');
	const attachmentWithMessage = (isAttachment && messageContent !== '');

	let logMessage;
	if (isAttachment && !attachmentWithMessage) {
		logMessage = `${logPrefix} ${username} uploaded attachment ${message.attachments.first().url}`;
	} else if (isAttachment && attachmentWithMessage) {
		logMessage = `${logPrefix} ${username} uploaded attachment ${message.attachments.first().url} with message [${cleanContent}]`;
	} else {
		logMessage = `${logPrefix} ${username}: ${cleanContent}`;
	}

	client.log.info(logMessage);

	const args    = messageContent.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd     = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (client.store.lockdowns.hasOwnProperty(channelId) && level < 3) {
		return message.delete();
	}

	/**
	*	Non-command messages
	*/
	if(messageContent.indexOf(client.config.prefix) !== 0) {
		if (messageContent.includes('discord') && messageContent.includes('invite')) {
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

		/**
		 * Handle distributing user XP
		 */
		(async () => xp.distribute(message, client))();

		return;
	}

	if (cmd) {
		const cooldown = (cmd.conf.cooldown * 1000) || 1500;
		const cooldownName = cmd.conf.globalCd ? cmd.help.name : cmd.help.name + userId;
		const messageTime = message.createdTimestamp;
		const bypassCooldown = userId === client.config.ownerId;
		if (cooldowns.hasOwnProperty(cooldownName)) {
			const expiration = cooldowns[cooldownName].ex;
			const timeLeft   = (expiration - messageTime);
			const response   = timeLeft <= 1000 ? 'Please try again.' : `Please try again in about ${ms(timeLeft, { long: true })}.`;
			const embed = new MessageEmbed()
				  .setColor('#aab8c2')
				  .setDescription(`\:timer: <@${userId}>, ${response}`);

			client.log.info(`${message.author.username} executed command [${cmd.help.name}] but is under a cooldown`);
			return message.channel.send({ embed });
		} else {
			try {
				GuildOnlyCommandError.assert(message.channel.type !== 'dm');
				InvalidCommandLocationError.assert(channelId !== '431266723736322048');

				if (channelId === '481201307257012262') {
					RefugeeCommandUsageError.assert(cmd.help.name === 'escape');
				}

				InsufficientPermissionsError.assert(level >= cmd.conf.permLevel, `You do not have permission to use this command. It requires a permission level of ${cmd.conf.permLevel} and you have a permission level of ${level}.`);

				await cmd.run(client, message, args, level);

				if (!bypassCooldown) {
					cooldowns[cooldownName] = { ex: (messageTime + cooldown) };
					client.setTimeout(() => delete cooldowns[cooldownName], cooldown);
				}

				client.log.info(`${message.author.username} executed command [${cmd.help.name}]`);
			} catch (err) {
				switch (err.constructor) {
					default:
						client.log.error(err.stack);
						return client.error(message, err.stack);
					case GuildOnlyCommandError:
						return message.author.send(err.message);
					case RefugeeCommandUsageError:
					case InvalidCommandLocationError:
						break;
					case MissingArgumentError:
					case InvalidArgumentError:
					case InvalidArgumentCountError:
					case InsufficientPermissionsError:
						const emoji = client.emojis.cache.find(e => e.name === 'caprineAlert');
						const embed = new MessageEmbed()
							.setColor(client.colors.red)
							.setDescription(`${emoji} \`${err.code}\` **${err.message}**`);
						return message.channel.send({ embed });
				}
			}
		}
	}
};