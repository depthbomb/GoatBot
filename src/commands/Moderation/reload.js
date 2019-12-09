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

exports.run = async (client, message, args, level) => {
	const path = require('path');
	if (!args || args.size < 1) return message.reply("Must provide a command to reload.");

	const item = args[0];

	if (item === 'config') {
		const configPath = path.join(client.rootPath, 'config.js');
		delete require.cache[require.resolve(configPath)];
		client.config = require(configPath).config;
		return message.reply('Configuration has been reloaded.');
	} else {
		let command;
		if (client.commands.has(item)) {
			command = client.commands.get(item);
		} else if (client.aliases.has(item)) {
			command = client.commands.get(client.aliases.get(item));
		}
		if (!command) return message.reply(`The command \`${item}\` doesn't seem to exist, nor is it an alias. Try again!`);
		command = command.help.name;
	
		delete require.cache[require.resolve(`./${command}.js`)];
		const cmd = require(`./${command}`);
		client.commands.delete(command);
		client.aliases.forEach((cmd, alias) => {
			if (cmd === command) client.aliases.delete(alias);
		});
		client.commands.set(command, cmd);
		cmd.conf.aliases.forEach(alias => {
			client.aliases.set(alias, cmd.help.name);
		});
	
		return message.reply(`The command \`${command}\` has been reloaded`);
	}
};

exports.conf = {
	enabled: true,
	aliases: [],
	permLevel: 10,
	deleteTrigger: true,
};

exports.help = {
	name: "reload",
	category: "System",
	description: "Reloads a command that has been modified.",
	usage: "reload [command]",
	params: {
		"command": "Command to reload"
	},
	examples: [
		"reload help"
	]
};