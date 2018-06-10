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

exports.run = async (client, message, args, level) => {
	const { RichEmbed } = require('discord.js');
	if (!args[0]) {
		let aboutEmbed = new RichEmbed()
			.setAuthor("About GoatBot!", client.user.avatarURL)
			.setColor(client.config.color)
			.setDescription(`I am a general purpose Discord bot with a variety of fun, informative, and moderative commands as well as useful statistical functions. I am owned and developed by <@${client.config.ownerId}> using the [Discord.js Node module](https://discord.js.org/).\n\I'm still a work-in-progress and new features as well as commands are still being developed. If you would like something to be added, contact <@${client.config.ownerId}> here on Discord, [Steam](https://steamcommunity.com/id/minorin), or make a post in the [Issue Tracker.](https://github.com/depthbomb/GoatBot/issues)`)
			.addField("Message from my creator", "GoatBot is maintained and hosted 100% by me out of pocket in my spare time. Like what I do? [Buy me a coffee!](https://www.buymeacoff.ee/depthbomb)")
			.addField("More Info",
				"`!about cooldowns`\n" +
				"`!about logging`\n"
			)
			.setFooter(`GoatBot ${client.config.botVersion} by depthbomb#7698`);
		message.author.send({
			embed: aboutEmbed
		});
	} else if (args && args[0] == "cooldowns") {
		let featuresEmbed = new RichEmbed()
			.setAuthor("About GoatBot | Cooldowns", client.user.avatarURL)
			.setColor(client.config.color)
			.setDescription(`All commands are susceptible to some sort per-user of delay or **cooldown**. This cooldown is to prevent abuse of the bot via command spamming and to limit some commands that rely on a third-party API that may have a request limit. By default, the cooldown of individual commands is ${client.config.cooldowns.default}s.\n\nSome commands may have a **global cooldown** where everyone shares the cooldown. To see what a command's cooldown is and if it has a global cooldown, type \`!help <command name>\`.`)
			.setFooter(`GoatBot ${client.config.botVersion} by depthbomb#7698`);
		message.author.send({
			embed: featuresEmbed
		});
	} else if (args && (args[0] == "logging" || args[0] == "logs")) {
		let loggingEmbed = new RichEmbed()
			.setAuthor("About GoatBot | Logging", client.user.avatarURL)
			.setColor(client.config.color)
			.setDescription(`I log all messages and events in channels that I have access to. However, I will keep this info private as it is used for general moderation and statistical purposes. If you wish to have entries related to you removed, please contact my owner.`)
			.setFooter(`GoatBot ${client.config.botVersion} by depthbomb#7698`);
		message.author.send({
			embed: loggingEmbed
		});
	} else {
		return;
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"abt",
		"info"
	],
	permLevel: 0
};

exports.help = {
	name: "about",
	category: "System",
	description: "Shows info about me",
	usage: "about [section?]",
	params: {
		"section": "(Optional) Section to read about"
	},
	examples: [
		"about",
		"about cooldowns"
	]
};