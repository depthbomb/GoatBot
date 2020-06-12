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

exports.run = (client, message, args, level) => {
	const settings = client.config;
	if (!args[0]) {
		const myCommands = message.guild ? client.commands.filter(cmd => cmd.conf.permLevel <= level) : client.commands.filter(cmd => cmd.conf.permLevel <= level);
		const commandNames = myCommands.keyArray();
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		let currentCategory = '';
		let output = `= Command List =\n\n[Use ${client.printCmd('help')} <command> for details. For bot details, type !about]\n`;

		const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
		sorted.forEach( c => {
			const cat = c.help.category.toProperCase();
			if (currentCategory !== cat) {
				output += `\n== ${cat} ==\n`;
				currentCategory = cat;
			}
			output += `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
		});
		return message.author.send(output, { code: 'asciidoc', split: true })
			  .then((msg) => message.react('📨'))
			  .catch(err => message.reply('I cannot send the commands to you. You must allow DMs from me for some commands to function.'));
	} else {
		let hasParams = false;
		let paramLine = '';
		let command;
		let parameters = [];
		if (client.commands.has(args[0])) {
			command = args[0];
		} else if (client.aliases.has(args[0])) {
			command = client.aliases.get(args[0]);
		}
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			if (level < command.conf.permLevel) return;

			const cooldown = command.conf.hasOwnProperty('cooldown') ? command.conf.cooldown : 1.5;
			const examples = [];
			command.help.examples.forEach((element) => {
				examples.push(`* ${settings.prefix}${element}`)
			});

			if(Object.keys(command.help.params).length !== 0) {
				hasParams = true;
				Object.keys(command.help.params).forEach((key, i) => {
					parameters.push(`${i + 1}. [${key}] - ${command.help.params[key]}`);
				});
			}

			if (command.conf.hasOwnProperty('requiredRole')) {
				requiresRole = 'Required Role\n-------------\n' + command.conf.requiredRole + '\n\n'
			} else {
				requiresRole = '';
			}

			if (hasParams) paramLine = `Parameters\n----------\n${parameters.join("\n")}\n\n`;

			return message.author.send(
				`# ${command.help.name.toProperCase()}\n` +
				`${command.help.description}\n\n` +
				`Cooldown\n--------\n${cooldown} seconds\n\n` +
				requiresRole +
				`Aliases\n-------\n${command.conf.aliases.length > 0 ? command.conf.aliases.join(", ") : 'None'}\n\n` +
				`Usage\n-----\n${settings.prefix}${command.help.usage}\n\n` +
				paramLine +
				`Examples\n--------\n${examples.join("\n")}\n\n`
				, {code: 'markdown', split: true}
			)
			.then(msg => message.react('📨'))
			.catch(err => message.reply('I cannot send the commands to you. You must allow DMs from me for some commands to function.'));
		}
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'h',
		'halp',
		'cmds',
		'commands'
	],
	permLevel: 0
};

exports.help = {
	name: 'help',
	category: 'Info',
	description: 'Displays all the available commands for your permission level.',
	usage: 'help [command?]',
	params: {
		'command': '(Optional) command to view details on'
	},
	examples: [
		'help',
		'help dice'
	]
};