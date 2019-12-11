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
const ms = require('ms');
const { RichEmbed } = require('discord.js');
module.exports = (client, message) => {
	/**
	*	Automatically delete messages in refugee camp and kennel after 10 minutes. Placed up at the top so we cover bot messages too.
	*/
	if (message.channel.id === client.config.refugeeChannel || message.channel.id === '481201307257012262') {
		setTimeout(() => {
			message.delete().catch(e => {});
		}, (600*1000));
	}

	if (message.author.bot || message.system) return;

	const isDm			= message.channel.type === 'dm';
	const isOwner		= (message.author.id === client.config.ownerId);
	const level			= client.permlevel(message);
	const isServerStaff = isDm ? false : (message.member.roles.find(r => r.name === client.config.roles.admin) || message.member.roles.find(r => r.name === client.config.roles.mod) || level > 2 || isOwner);
	const isTF2Staff 	= isDm ? false : (message.member.roles.find(r => r.name === 'TF2 Server Staff'));

	let logPrefix = [];
	let username = message.member !== null ? message.member.displayName : message.author.tag;

	if (!isDm && message.member.guild.available) logPrefix.push(`[${message.member.guild.name}]`);

	if (isDm) logPrefix.push("(DM)");
	else logPrefix.push(`#${message.channel.name}`);

	if (message.tts) logPrefix.push('[TTS]');

	let isAttachment = false;
	let attachmentWithMessage = false;

	let logMessage;

	if (typeof message.attachments.first() != 'undefined') isAttachment = true;
	if (isAttachment && message.content !== "") attachmentWithMessage = true;

	if (isAttachment && !attachmentWithMessage)	logMessage = `${logPrefix.join(" ")} ${username} uploaded attachment ${message.attachments.first().url}`;
	else if (isAttachment && attachmentWithMessage)	logMessage = `${logPrefix.join(" ")} ${username} uploaded attachment ${message.attachments.first().url} with message [${message.cleanContent}]`;
	else logMessage = `${logPrefix.join(" ")} ${username}: ${message.cleanContent}`;

	client.log("msg", logMessage);

	const args		= message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command	= args.shift().toLowerCase();
	const cmd		= client.commands.get(command) || client.commands.get(client.aliases.get(command));

	/**
	*	Non-command messages
	*/
	if(message.content.indexOf(client.config.prefix) !== 0) {
		/**
		*	React to OwO's
		*/
		if (null !== message.content.match(/\b([O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F][Ww\uA4B3\u03C9][O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F])\b/)) {
			const reactArray = ['🍌', '🍆', '🥒'];
			const randomEmoji = reactArray.shuffle()[0];
			return message.react(randomEmoji);
		}

		/**
		*	Lit
		*/
		if (null !== message.content.match(/\blit\b/i)) message.react("🔥");

		if (
			null !== message.content.match(/^(https?:\/\/)?discord\.gg(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
			null !== message.content.match(/^(https?:\/\/)?discord\.gg\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
			null !== message.content.match(/^(https?:\/\/)?discordapp\.com\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig)
		) {
			if (message.channel.type === 'dm') return;
			if (isServerStaff) return;

			if (!message.content.includes('discord.gg/xw624a8') || !message.content.includes('discord.gg/invite/xw624a8') || !message.content.includes('discordapp.com/invite/xw624a8')) {
				message.delete().then(m => {
					return m.reply('Discord invite links are not allowed. Please keep those links to DMs.');
				}).catch(e => {});
			}
		}

		if (
			null !== message.content.match(/f[a@α4]+[g\u011F]([g\u011F]+[o\u03BF0]+t)?/ig) ||
			null !== message.content.match(/[n\u00F1][\s_\-.,+^*#&:;~$!\`%]*?[i1!l|\\\/#*]+[\s_\-.,+^*#&:;~$!\`%\u012F]*?[gq9\u011F][\s_\-.,+^*#&:;~$!\`%]*?[\u011Fgq9#*\s][\s_\-.,+^*#&:;~$!\`%]*?[e3a4\u00E3\u03B1@#*\s]?[\s_\-.,+^*#&:;~$!\`%]*?r/ig)
		) {
			if (message.channel.type === 'dm' || isTF2Staff) return;
			if (!isOwner || level < 2) {
				message.delete().then(msg => {
					return client.kennelUser(msg, msg.member, '[Auto] Discriminatory language is not tolerated.');
				}).catch(e => {});
			}
		}

		// if (null !== message.content.match(/word/i)) {}
		/*--------------------------------------------------------------------------*/

		return;
	}

	// If the command exists, **AND** the user has permission, run it.
	if (cmd) {
		if (
			//	Prevent commands from being used in refugee camp
			message.channel.id === '431266723736322048' ||
			//	Prevent commands from being used outside of guilds
			!message.guild ||
			//	Prevent commands from being used in the Kennel if the command is not !escape and the user is not elevated
			(cmd.help.name !== 'escape' && message.channel.id === '481201307257012262' && level < 3)
		) return;

		// if (client.strictMode.enabled && level < 2) {
		// 	if (!client.config.strictMode.commandChannels.includes(message.channel.id)) {
		// 		return client.msg(message, 'red', 'error', 'Commands may only be used in the <#420816699626094592> channel while strict mode is enabled.');
		// 	}
		// }

		if (level >= cmd.conf.permLevel) {
			const cooldown = (cmd.conf.cooldown * 1000) || 1500;
			const cooldownName = cmd.conf.globalCd ?
				  `${cmd.help.name}_GLOBAL` :
				  `${cmd.help.name}_${message.author.id}`;
			const messageTime = message.createdTimestamp;
			const bypassCooldown = message.author.id === client.config.ownerId;

			if (cooldowns.hasOwnProperty(cooldownName)) {
				const expiration = cooldowns[cooldownName].ex;
				const timeLeft   = (expiration - messageTime);
				const response   = timeLeft <= 1000 ? 'Please try again.' : `Please try again in about ${ms(timeLeft, { long: true })}.`;
				const embed = new RichEmbed()
					  .setColor('#aab8c2')
					  .setDescription(`\:timer: <@${message.author.id}>, ${response}`);

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