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

const crypto = require('crypto');
const { MessageEmbed } = require('discord.js');
module.exports = client => {
	client.awaitReply = async (msg, question, limit = 60000) => {
		const filter = m => m.author.id = msg.author.id;
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
			return collected.first().content;
		} catch (e) {
			return false;
		}
	};

	client.error = (msg, err) => {
		const algorithm = 'aes-256-gcm';
		const key = client.config.crypto.key;
		const iv  = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
		const errorStack = `**UserID:** ${msg.author.id}\n**ChannelID:** ${msg.channel.id}\n**DM?:** ${msg.channel.type === 'dm'}\n${msg.guild.available ? '**Guild:** ' + msg.guild.name + '\n' : ''}\n\`\`\`js\n${err}\n\`\`\``;
	
		let encrypted = cipher.update(errorStack);
			encrypted = Buffer.concat([encrypted, cipher.final()]);

		const crashCode = Buffer.from(client.config.version+'::'+iv.toString('hex')+'::'+encrypted.toString('hex')).toString('base64');
		const embed = new MessageEmbed()
			  .setColor(client.colors.red)
			  .setDescription('OOPSIE WOOPSIE!! UwU I made a fucky wucky!! A wittle fucko boingo! My cweator is working VEWY HAWD to fix this! Send them this   code belowo if you see him!')
			  .addField('\u200B', `\`\`\`\n${crashCode}\n\`\`\``, true)
			  .setThumbnail(client.emojis.cache.find(e => e.name === 'caprineAlert').url);
	
		return msg.reply({ embed });
	};

	client.msg = (messageObj, type, icon, message, reply = true) => {
		const colors = {
			'black': client.colors.black,
			'yellow': client.colors.yellow,
			'default': client.colors.brand,
			'red': client.colors.red,
			'orange': client.colors.orange,
			'green': client.colors.green,
			'blue': client.colors.blue
		};
		const emojis = {
			'gold': client.emojis.cache.find(e => e.name === 'caprineGold'),
			'error': client.emojis.cache.find(e => e.name === 'caprineAlert'),
			'warning': client.emojis.cache.find(e => e.name === 'caprineWarning'),
			'success': client.emojis.cache.find(e => e.name === 'caprineSuccess'),
			'info': client.emojis.cache.find(e => e.name === 'caprineInfo'),
			'close': client.emojis.cache.find(e => e.name === 'caprineAlert')
		};
		const color = colors[type];
		const emoji = emojis[icon];
		const embed = new MessageEmbed()
				.setColor(color)
				.setDescription(`${emoji} ${reply ? '<@' + messageObj.author.id + '>, ' : ''}${message}`);
	
		return messageObj.channel.send({ embed });
	};

	client.logAction = (title, logMessage, color = client.colors.default, authorName, authorImage = client.guilds.cache.find(g => g.id === client.config.mainGuild).iconURL({ dynamic: true })) => {
		if (client.disableLog) return;
		const logChannel = client.channels.cache.find(c => c.id === client.config.logChannel);
		const embed = new MessageEmbed()
			.setColor(color)
			.setTimestamp()
			.setTitle(title)
			.setDescription(logMessage)
		;
	
		if (authorName && authorImage) embed.setAuthor(authorName, authorImage);
		return logChannel.send({ embed });
	};

	client.kennelUser = (member, reason, issuer = 'GoatBot!') => {
		const kennelRole = member.guild.roles.cache.find(r => r.name === 'Kenneled');
		const nsfwRole = member.roles.cache.find(r => r.name === 'NSFW');
		const kennelChannel = member.guild.channels.cache.find(c => c.id === '481201307257012262');
	
		if (!member.roles.cache.find(r => r.name === 'Kenneled')) {
			let embed = new MessageEmbed()
				.setColor(client.colors.red)
				.setTitle('User Kenneled')
				.setDescription(`User \`${member.displayName}\` has been kenneled by **${issuer}**`)
				.addField('Reason', reason);
	
			member.roles.remove(nsfwRole, 'Removed due to kenneling').catch(() => {});
			member.roles.add(kennelRole, reason).then(() => {
				member.edit({ mute: true, deaf: true }, 'User kenneled');
				kennelChannel.send({ embed }).then(m => {
					embed = new MessageEmbed()
						.setColor(client.colors.red)
						.setDescription(`<@${member.user.id}>, you have been placed in the kennel by ${issuer}. You will be here indefinitely until you can \`${client.printCmd('escape')}\`. Some of your roles have been stripped and will need to be reacquired once you escape.`)
						.addField('Reason', reason);
					kennelChannel.send({ embed });
				});
			});
		}
	};

	client.clean = async (client, text) => {
		if (text && text.constructor.name == 'Promise')
		text = await text;
		if (typeof evaled !== 'string')
		text = require('util').inspect(text, { depth: 0 });
	
		text = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(client.token, '{null}');
	
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
};