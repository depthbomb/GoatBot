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
	if (!args || args.size < 1) return message.reply("Must provide a command to reload.");

	let command;
	if (client.commands.has(args[0])) {
		command = client.commands.get(args[0]);
	} else if (client.aliases.has(args[0])) {
		command = client.commands.get(client.aliases.get(args[0]));
	}
	if (!command) return message.reply(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);
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
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 10
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