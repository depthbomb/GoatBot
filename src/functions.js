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

module.exports = (client) => {
	client.awaitReply = async (msg, question, limit = 60000) => {
		const filter = m => m.author.id = msg.author.id;
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch (e) {
			return false;
		}
	};

	client.error = (msg, err) => {
		const { RichEmbed } = require('discord.js');
		const crypto = require('crypto');
		const algorithm = 'aes-256-cbc';
		const key = client.config.crypto.errorSalt;
		const cipher = crypto.createCipher(algorithm, key);
		const errorStack = `**UserID:** ${msg.author.id}\n**ChannelID:** ${msg.channel.id}\n**DM?:** ${msg.channel.type === "dm"}\n${msg.guild.available ? "**Guild:** " + msg.guild.name + "\n" : ""}\n\`\`\`JS\n${err}\n\`\`\``;

		let encrypted = cipher.update(errorStack, "utf8", "base64");
			encrypted += cipher.final('base64');

		let embed = new RichEmbed()
			.setAuthor("OOPSIE WOOPSIE!!", client.user.avatarURL)
			.setColor(client.colors.red)
			.setDescription("OOPSIE WOOPSIE!! UwU I made a fucky wucky!! A wittle fucko boingo! My cweator is working VEWY HAWD to fix this! Send them this code belowo if you see him!")
			.addField("\u200B", `\`\`\`\n${encrypted}\n\`\`\``, true)
			.setThumbnail(client.emojis.find("name", "caprineError").url);

		return msg.reply({ embed });
	};

	/**
	 * Sends a fancy-looking message
	 * @param {object} messageObj Message object, used for replying
	 * @param {string} type Embed color
	 * @param {string} icon Emoji
	 * @param {string} message Message
	 * @param {bool} reply Whether to ping the invoking user
	 * @param {bool} autoDelete Whether to auto-delete sent message
	 * @param {bool} autoDeleteDelay Delay in seconds when deleting the message
	 */
	client.msg = (messageObj, type, icon, message, reply = true, autoDelete = false, autoDeleteDelay = 10) => {
		const { RichEmbed } = require('discord.js');
		const colors = {
			"black": "#212121",
			"yellow": "#faa61a",
			"default": "#99aab5",
			"red": "#f04747",
			"orange": "#f57731",
			"green": "#43b581",
			"blue": "#3498db"
		};
		const emojis = {
			"gold": client.emojis.find(e => e.name === "caprineGold"),
			"ungag": client.emojis.find(e => e.name === "caprineCommentNormal"),
			"gag": client.emojis.find(e => e.name === "caprineGag"),
			"mute": client.emojis.find(e => e.name === "caprineMute"),
			"search": client.emojis.find(e => e.name === "caprineSearch"),
			"refresh": client.emojis.find(e => e.name === "caprineRefresh"),
			"error": client.emojis.find(e => e.name === "caprineClose"),
			"warning": client.emojis.find(e => e.name === "caprineWarning"),
			"success": client.emojis.find(e => e.name === "caprineSuccess"),
			"info": client.emojis.find(e => e.name === "caprineInfo"),
			"close": client.emojis.find(e => e.name === "caprineClose")
		};
		const color = colors[type];
		const emoji = emojis[icon];
		const embed = new RichEmbed()
					.setColor(color)
					.setDescription(`${emoji} ${reply ? "<@" + messageObj.author.id + ">, " : ""}${message}`);

		return messageObj.channel.send({ embed }).then(m => {
			if (autoDelete) {
				setTimeout(() => {
					m.delete();
				}, autoDeleteDelay * 1000);
			}
		});
	};


	/**
	 * Logs an action to the log channel
	 * @param {string} title Action title
	 * @param {string} logMessage Log message
	 * @param {string} color Log color
	 * @param {string} authorName "Author" name
	 * @param {string} authorImage "Author" image
	 */
	client.logAction = (title, logMessage, color = client.colors.default, authorName, authorImage = client.guilds.find(g => g.id === client.config.mainGuild).iconURL) => {
		if (client.disableLog) return;
		const { RichEmbed } = require('discord.js');
		const logChannel = client.channels.find(c => c.id === client.config.logChannel);
		const embed = new RichEmbed()
			.setColor(color)
			.setTimestamp()
			.setTitle(title)
			.setDescription(logMessage)
		;

		if (authorName && authorImage) embed.setAuthor(authorName, authorImage);
		return logChannel.send({ embed });
	};


	client.kennelUser = (message, user, reason, issuer = 'GoatBot!') => {
		const member = message.member;
		const kennelRole = member.guild.roles.find(r => r.name === 'Kenneled').id;
		const kennelChannel = member.guild.channels.find(c => c.id === '481201307257012262');

		if (!user.roles.find(r => r.name === 'Kenneled')) {
			const { RichEmbed } = require('discord.js');
			let embed = new RichEmbed()
				.setColor(client.colors.red)
				.setTitle('User Kenneled')
				.setDescription(`User \`${user.displayName}\` has been kenneled by **${issuer}**`)
				.addField('Reason', reason)
			;

			if (user.roles.find(r => r.name === 'NSFW')) user.removeRole(user.roles.find(r => r.name === 'NSFW'));
			if (user.roles.find(r => r.name === 'Deejay')) user.removeRole(user.roles.find(r => r.name === 'Deejay'));

			user.addRole(kennelRole, reason).then(() => {
				member.setDeaf(true, 'Deafened due to kenneling').catch(() => {});
				member.setMute(true, 'Muted due to kenneling').catch(() => {});
				message.channel.send({ embed }).then(m => {
					embed = new RichEmbed()
						.setColor(client.colors.red)
						.setDescription(`<@${user.id}>, you have been placed in the kennel by ${issuer}. You will be here indefinitely until you can \`${client.printCmd('escape')}\`. Some of your roles have been stripped and will need to be reacquired once you escape.`)
						.addField('Reason', reason)
					;
					kennelChannel.send({ embed });
				});
			});
		}
	};


	client.clean = async (client, text) => {
		if (text && text.constructor.name == "Promise")
		text = await text;
		if (typeof evaled !== "string")
		text = require("util").inspect(text, { depth: 0 });

		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(client.token, "{null}");

		return text;
	};


	client.randomInt = (min, max, amount = 1, forceArray = false) => {
		let results;
		if (amount > 1 || forceArray) {
			results = [];
			for (let i = 0; i < amount; i++) {
				results.push(Math.floor(Math.random() * (max - min + 1)) + min);
			}

		} else {
			results = Math.floor(Math.random() * (max - min + 1)) + min;
		}

		return results;
	};


	String.prototype.parseTimeFormat = function() {
		const format          = this;
		const timeFormatRegex = /(\d+w)?(\d+d)?(\d+h)?(\d+m)?/i;
		const converter       = { m: 60, h: 60*60, d: 60*60*24, w: 60*60*24*7 };
		if (timeFormatRegex.test(format)) {
			let matches = timeFormatRegex.exec(format);
			//	Remove first item from matches (full group match, useless in this case)	
			matches.shift();
			//	Remove all undefined/blank/false values
			matches = matches.filter(Boolean);

			let duration = 0;
			const now = client.timestamp();
			for (let match of matches) {
				const dur = match.replace(/[0-9]/g, '');
				const num = parseInt(match.replace(/\D/g, ''));
				const out = num * converter[dur];
				duration = (duration + out);
			}
			return (now + duration);
		} else {
			return null;
		}
	};


	String.prototype.toProperCase = function () {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};


	String.prototype.usToSp = function () {
		return this.replace(/_/g, ' ');
	};


	String.prototype.scramble = function () {
		let a = this.split(""),
		n = a.length;

		for (let i = n - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join("");
	};


	String.prototype.toProperCase = function () {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};


	Array.prototype.allValuesSame = function () {
		for(let i = 1; i < this.length; i++)
		{
			if(this[i] !== this[0])
				return false;
		}
		return true;
	};


	Array.prototype.shuffle = function () {
		let currentIndex = this.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this[currentIndex];
			this[currentIndex] = this[randomIndex];
			this[randomIndex] = temporaryValue;
		}

		return this;
	};

	Number.prototype.reduce = function (percent, fix = false) {
		let num = (this - this * percent);
		if (fix) num = num.toFixed(2);
		return num;
	};


	Number.prototype.increase = function (percent, fix = false) {
		let num = (this + this * percent);
		if (fix) num = num.toFixed(2);
		return num;
	};


	// `await client.wait(1000);` to "pause" for 1 second.
	client.wait = require("util").promisify(setTimeout);
};