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
	if (message.author.bot) return;

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
			if (!client.config.allowances.channels.includes(message.channel.id)) return;

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
						m.reply(`You have reached your max allowance for images sent in non-media channels. This allowance resets in about ${moment.unix(client.allowances.images[message.author.id].expires).toNow(true)}.`);
					});
				}
			}
		}

		if (isUrl) {
			if (!client.config.allowances.enabled) return;
			if (!client.config.allowances.channels.includes(message.channel.id)) return;

			const urlsMax = client.config.allowances.urls;

			if (!client.allowances.urls.hasOwnProperty(message.author.id)) {
				client.allowances.urls[message.author.id] = {
					amount: 1,
					expires: moment().add(client.config.allowances.expiration, 'm').format('X')
				};
			} else {
				if (client.allowances.urls[message.author.id].amount < urlsMax) {
					client.allowances.urls[message.author.id] = {
						amount: client.allowances.urls[message.author.id].amount + 1,
						expires: moment().add(client.config.allowances.expiration, 'm').format('X')
					};
				} else {
					return message.delete().then(m => {
						m.reply(`You have reached your max allowance for URLs sent. This allowance resets in about ${moment.unix(client.allowances.urls[message.author.id].expires).toNow(true)}.`);
					});
				}
			}
		}

		client.log("msg", logMessage);
	}

	const args			= message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command		= args.shift().toLowerCase();
	const rawMessage	= message.content;
	const isAdmin		= (message.author.id === client.config.ownerId);
	const level			= client.permlevel(message);
	const cmd			= client.commands.get(command) || client.commands.get(client.aliases.get(command));

	/**
	* Reading from non-command messages
	*/
	if(message.content.indexOf(client.config.prefix) !== 0) {
        /*
        |--------------------------------------------------------------------------
        | Non-commands
        |--------------------------------------------------------------------------
        */


		/**
		* Automatically delete refugee messages after 5 minutes of sending
		*/
		if (message.channel.id === client.config.refugeeChannel) {
			setTimeout(() => {
				message.delete();
			}, (300*1000));
		}


        /**
        * React to OwO's
        */
        if (null !== message.content.match(/\b([O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F][Ww\uA4B3\u03C9][O\u00D2\u00D3\u00D4\u00D5\u00D6o\u00F2\u00F3\u00F4\u00F5\u00F6\u1D52\u25CF\u0150\uFF65\u03C3\u2579\u25CD0\u2661\u01A1\u25D5\u273F])\b/)) {
            client.log("bot", 'OwO detected!');
            let reactArray = ['🍌', '🍆', '🥒'];
            reactArray.shuffle();
            message.react(reactArray[0]);
        }

		/**
		* Lit
		*/
		if (null !== message.content.match(/\blit\b/i)) {
			message.react("🔥");
		}

		if (message.cleanContent === '** **' ||
			message.cleanContent === '.' ||
			message.cleanContent === ',' ||
			message.cleanContent === '_' ||
			message.cleanContent === '-' ||
			message.cleanContent === '*' ||
			message.cleanContent === '+' ||
			message.cleanContent === '=' ||
			message.cleanContent === '`' ||
			message.cleanContent === '~'
		) {
			message.delete();
		}

		/**
		* Dunk
		*/
		if (null !== (message.content.match(/\bdunk[s]?\b/i) || message.content.match(/\bdunked\b/i))) {
			message.react("🏀");
		}

		if (message.content.toLowerCase().trim() === "beep beep" ||
			message.content.toLowerCase().trim() === "beep beep im a sheep" ||
			message.content.toLowerCase().trim() === "beep beep i'm a sheep" ||
			message.content.toLowerCase().trim() === "beep beep ima sheep"
		) {
			message.author.send("https://www.youtube.com/watch?v=wCZFISvHmyY");
		}

		if (null !== message.content.match(/^(https?:\/\/)?discord(?:app\.com|\.gg)[\/invite\/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})$/ig)) {
			if (message.content === 'https://discord.gg/xw624a8' || message.content === 'https://discordapp.com/invite/xw624a8') return;

			if (message.author.id !== message.guild.owner.id || level < 2) {
				message.delete();
			}
		}

		if (null !== message.content.match(/[n\u00F1]+[\s_\-.,+^*#&:;~$!\`%]*?[i1l\u012F]+[\s_\-.,+^*#&:;~$!\`%]*?[g\u011F]+[\s_\-.,+^*#&:;~$!\`%]*?[g\u011F]+[\s_\-.,+^*#&:;~$!\`%]*?[a4@\u03B1]+/ig) ||
			null !== message.content.match(/f[a@α4]+[g\u011F]([g\u011F]+[o\u03BF0]+t)?/ig) ||
			null !== message.content.match(/[n\u00F1][\s_\-.,+^*#&:;~$!\`%]*?[i1!l|\\\/#*]+[\s_\-.,+^*#&:;~$!\`%\u012F]*?[gq9\u011F][\s_\-.,+^*#&:;~$!\`%]*?[\u011Fgq9#*\s][\s_\-.,+^*#&:;~$!\`%]*?[e3a4\u00E3\u03B1@#*\s]?[\s_\-.,+^*#&:;~$!\`%]*?r/ig)) {
			if (message.channel.type === 'dm') return;
			if (message.author.id !== message.guild.owner.id || level < 2) {
				message.delete().then(msg => {
					msg.reply('_Whoops!_ You can\'t say that in a Christian guild!').then(rMessage => {
						setTimeout(() => {
							rMessage.delete();
						}, 10000);
					});
				});
			}
		}

		// if (null !== message.content.match(/word/i)) {}
		/*--------------------------------------------------------------------------*/

		return;
	}

	// Some commands may not be useable in DMs. This check prevents those commands from running
	// and return a friendly error message.
	if (cmd && !message.guild && cmd.conf.guildOnly) return message.reply("This command cannot be executed in a DM conversation.");

	// If the command exists, **AND** the user has permission, run it.
	if (cmd) {

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
					cmd.run(client, message, args, level);
				}
			});
		} else {
			client.log("system", `${message.author.username} attempted to execute command [${cmd.help.name}] but does not have permission`);

			return client.msg(message, 'red', 'error', `You do not have permission to use this command. It requires a permission level of ${cmd.conf.permLevel} and you have a permission level of ${level}.`, true);
		}
	}
};