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

module.exports = (client, message) => {
	const ms = require('ms');
	const moment = require('moment');

	/**
	*	Automatically delete messages in refugee camp and kennel after 10 minutes. Placed up at the top so we cover bot messages too.
	*/
	if (message.channel.id === client.config.refugeeChannel || message.channel.id === '481201307257012262') {
		setTimeout(() => {
			message.delete().catch(e => {});
		}, (600*1000));
	}

	if (message.author.bot) return;

	const rawMessage	= message.content;
	const isAdmin		= (message.author.id === client.config.ownerId);
	const level			= client.permlevel(message);
	const isServerStaff = message.channel.type === 'dm' ? false : (message.member.roles.find(r => r.id === client.config.roles.admin) || message.member.roles.find(r => r.id === client.config.roles.mod) || level > 2 || isAdmin);

	if (!message.system) {
		let logPrefix = [];
		let username = message.member !== null ? message.member.displayName : message.author.tag;

		if (message.channel.type !== "dm" && message.member.guild.available) logPrefix.push(`[${message.member.guild.name}]`);

		if (message.channel.type === "dm") logPrefix.push("(DM)");
		else logPrefix.push(`(${message.channel.name})`);

		if (message.tts) logPrefix.push('[TTS]');

		let isAttachment = false;
		let isImage = false;
		let attachmentWithMessage = false;
		let isUrl = false;

		let logMessage;

		if (typeof message.attachments.first() != 'undefined') isAttachment = true;
		if (isAttachment && message.attachments.first().width != undefined) isImage = true;
		if (isAttachment && message.content !== "") attachmentWithMessage = true;
		if (null !== message.cleanContent.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi)) isUrl = true;

		if (isAttachment && !attachmentWithMessage)	logMessage = `${logPrefix.join(" ")} ${username} uploaded attachment ${message.attachments.first().url}`;
		else if (isAttachment && attachmentWithMessage)	logMessage = `${logPrefix.join(" ")} ${username} uploaded attachment ${message.attachments.first().url} with message [${message.cleanContent}]`;
		else logMessage = `${logPrefix.join(" ")} ${username}: ${message.cleanContent}`;

		if (isImage) {
			if (!client.config.allowances.enabled) return;
			if (!client.config.allowances.channels.includes(message.channel.id) || isServerStaff) return;

			const imagesMax = client.config.allowances.images;

			if (!client.allowances.images.hasOwnProperty(message.author.id)) {
				client.allowances.images[message.author.id] = {
					amount: 1,
					expires: moment().add(client.config.allowances.expiration, 'm').format('X')
				};
			} else {
				if (client.allowances.images[message.author.id].amount < imagesMax) {
					client.allowances.images[message.author.id] = {
						amount: client.allowances.images[message.author.id].amount + 1,
						expires: moment().add(client.config.allowances.expiration, 'm').format('X')
					};
				} else {
					return message.delete().then(m => {
						m.reply(`You have reached your max allowance for images sent in non-media channels. This allowance resets in ${moment.unix(client.allowances.images[message.author.id].expires).toNow(true)}.`);
					});
				}
			}
		}

		if (isUrl) {
			if (!client.config.allowances.enabled) return;
			if (!client.config.allowances.channels.includes(message.channel.id) || isServerStaff) return;

			const urlsMax = client.config.allowances.links;

			if (!client.allowances.links.hasOwnProperty(message.author.id)) {
				client.allowances.links[message.author.id] = {
					amount: 1,
					expires: moment().add(client.config.allowances.expiration, 'm').format('X')
				};
			} else {
				if (client.allowances.links[message.author.id].amount < urlsMax) {
					client.allowances.links[message.author.id] = {
						amount: client.allowances.links[message.author.id].amount + 1,
						expires: moment().add(client.config.allowances.expiration, 'm').format('X')
					};
				} else {
					return message.delete().then(m => {
						m.reply(`You have reached your max allowance for URLs sent. This allowance resets in ${moment.unix(client.allowances.links[message.author.id].expires).toNow(true)}.`);
					});
				}
			}
		}

		client.log("msg", logMessage);
	}

	const args			= message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command		= args.shift().toLowerCase();
	const cmd			= client.commands.get(command) || client.commands.get(client.aliases.get(command));

	/**
	*	Reading from non-command messages
	*/
	if(message.content.indexOf(client.config.prefix) !== 0) {
        /*
        |--------------------------------------------------------------------------
        | Non-commands
        |--------------------------------------------------------------------------
        */


        /**
        *	React to OwO's
        */
        if (null !== message.content.match(/\b([O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F][Ww\uA4B3\u03C9][O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F])\b/)) {
            let reactArray = ['🍌', '🍆', '🥒'];
            reactArray.shuffle();
            return message.react(reactArray[0]);
        }

		/**
		*	Lit
		*/
		if (null !== message.content.match(/\blit\b/i)) {
			return message.react("🔥");
		}

		/**
		*	Message filter
		*/
		if (
			//	Remove gimmicky blank messages
			null !== message.content.match(/```[\s\n\t]+```/g) ||
			null !== message.content.match(/`[\s\n\t]+`/g) ||
			null !== message.content.match(/\*\*[\s\n\t]+\*\*/g) ||
			null !== message.content.match(/\*[\s\n\t]+\*/g) ||
			null !== message.content.match(/_[\s\n\t]+_/g) ||

			//	Remove single character responses
			null !== message.content.match(/_[.,_\-*+=`~]{1}_/g) ||
			null !== message.content.match(/^(\*?[.,_\-*+=`~]{1}\*?)$/g)
		) {
			if (isServerStaff) return;
			return message.delete();
		}

		/**
		*	Dunk
		*/
		if (
			null !== (message.content.match(/\bdunk[s]?\b/i) ||
			message.content.match(/\bdunked\b/i))
		) {
			return message.react("🏀");
		}

		if (message.content.toLowerCase().trim() === "beep beep" ||
			message.content.toLowerCase().trim() === "beep beep im a sheep" ||
			message.content.toLowerCase().trim() === "beep beep i'm a sheep" ||
			message.content.toLowerCase().trim() === "beep beep ima sheep"
		) {
			return message.author.send("https://www.youtube.com/watch?v=wCZFISvHmyY");
		}

		if (
			null !== message.content.match(/^(https?:\/\/)?discord\.gg(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
			null !== message.content.match(/^(https?:\/\/)?discord\.gg\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig) ||
			null !== message.content.match(/^(https?:\/\/)?discordapp\.com\/invite\/(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig)
		) {
			if (message.channel.type === 'dm') return;
			if (isServerStaff) return;

			if (
				message.content.includes('https://discord.gg/xw624a8') ||
				message.content.includes('https://discord.gg/invite/xw624a8') ||
				message.content.includes('https://discordapp.com/invite/xw624a8')
			) {
				message.delete().then(m => {
					return message.reply('Please use our own Discord invite link: `https://cyan.tf/discord`');
				});
			} else {
				message.delete().then(m => {
					return client.kennelUser(m, m.member, '[Auto] Discord invite links are not allowed. Please keep those links to DMs.');
				});
			}
		}

		if (null !== message.cleanContent.match(/(?:https?:\/\/)?steamcommunity\.com\/groups\/[a-zA-Z0-9-_]{3,32}/ig)) {
			if (null !== message.content.match(/(?:https?:\/\/)?steamcommunity\.com\/groups\/CyanTF/) || message.channel.type === 'dm') return;
			if (!isServerStaff) {
				message.delete().then(m => {
					return client.kennelUser(m, m.member, '[Auto] Steam community group links are not allowed. Please keep those links to DMs.');
				});
			}
		}

		if (
			null !== message.content.match(/[n\u00F1]+[\s_\-.,+^*#&:;~$!\`%]*?[i1l\u012F]+[\s_\-.,+^*#&:;~$!\`%]*?[g\u011F]+[\s_\-.,+^*#&:;~$!\`%]*?[g\u011F]+[\s_\-.,+^*#&:;~$!\`%]*?[a4@\u03B1]+/ig) ||
			null !== message.content.match(/f[a@α4]+[g\u011F]([g\u011F]+[o\u03BF0]+t)?/ig) ||
			null !== message.content.match(/[n\u00F1][\s_\-.,+^*#&:;~$!\`%]*?[i1!l|\\\/#*]+[\s_\-.,+^*#&:;~$!\`%\u012F]*?[gq9\u011F][\s_\-.,+^*#&:;~$!\`%]*?[\u011Fgq9#*\s][\s_\-.,+^*#&:;~$!\`%]*?[e3a4\u00E3\u03B1@#*\s]?[\s_\-.,+^*#&:;~$!\`%]*?r/ig)
		) {
			if (message.channel.type === 'dm') return;
			if (message.author.id !== message.guild.owner.id || level < 2) {
				message.delete().then(msg => {
					return client.kennelUser(m, m.member, '[Auto] Discriminatory language is not tolerated.');
				});
			}
		}

		// if (null !== message.content.match(/word/i)) {}
		/*--------------------------------------------------------------------------*/

		return;
	}

	// If the command exists, **AND** the user has permission, run it.
	if (cmd) {

		// Some commands may not be useable in DMs. This check prevents those commands from running and return a friendly error message.
		if (!message.guild && cmd.conf.guildOnly) return message.reply("This command cannot be executed in a DM conversation.");

		if (cmd.help.name !== 'escape' && message.channel.id === '481201307257012262' && level < 3) return;

		if (client.strictMode.enabled && level < 2) {
			if (!client.config.strict_mode.command_channels.includes(message.channel.id)) {
				return client.msg(message, 'red', 'error', 'Commands may only be used in the <#420816699626094592> channel while strict mode is enabled.');
			}
		}

		if (level >= cmd.conf.permLevel) {

			let cooldown;

			if (!cmd.conf.hasOwnProperty('cooldown')) {
				cooldown = client.config.cooldowns.default * 1000;
			} else {
				cooldown = cmd.conf.cooldown * 1000;
			}

			let cooldownName;
			
			if (!cmd.conf.globalCd) {
				cooldownName = `c_${cmd.help.name}_${message.author.id}`;
			} else {
				cooldownName = `c_${cmd.help.name}_GLOBAL`;
			}
			client.cooldown(message, cooldownName, cooldown, true, (cd) => {
				if (cd) {
					client.log("system", `${message.author.username} executed command [${cmd.help.name}] but is under a cooldown.`);
				} else {
					client.log("system", `${message.author.username} executed command [${cmd.help.name}]`);
					return cmd.run(client, message, args, level);
				}
			});
		} else {
			client.log("system", `${message.author.username} attempted to execute command [${cmd.help.name}] but does not have permission`);

			return client.msg(message, 'red', 'error', `You do not have permission to use this command. It requires a permission level of ${cmd.conf.permLevel} and you have a permission level of ${level}.`, true);
		}
	}
};