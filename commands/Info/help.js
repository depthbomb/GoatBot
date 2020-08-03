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

const embedCache = {};
const commandCache = {};

const ms = require('ms');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;
	const command = args[0]?.trim();
	if (!command) {	//	Display all commands for user's permission level
		let commands;
		if (!commandCache.hasOwnProperty(userId)) {
			const cmds = client.commands.filter(c => c.conf.permLevel <= level);

			const categories = [];
			for (let cmd of cmds.array()) {
				categories.push(cmd.help.category);
			}
	
			const categorized = {};
			for (let cat of categories) {
				const complyingCommand = cmds.filter(c => c.help.category === cat);
				categorized[cat] = [];
				categorized[cat].push(complyingCommand);
			}
	
			commands = categorized;
			commandCache[userId] = categorized;
		} else {
			commands = commandCache[userId];
		}

		const embed = new MessageEmbed()
			  .setTitle('Commands')
			  .setColor(client.colors.brand)
			  .setThumbnail(client.emojis.cache.find(e => e.name === 'caprineCommand').url)
			  .setDescription(`Here are all of my commands! You can read detailed info about a single command by typing \`${client.printCmd('help')} [command]\`.`)
			  .setFooter(`You can read detailed info about a single command by typing ${client.printCmd('help')} [command]`);
		
		for (let cat of Object.keys(commands)) {
			const cmds = commands[cat][0].keys();
			const printedCmds = [];
			for (let c of cmds) {
				printedCmds.push(client.printCmd(c));
			}

			embed.addField(cat, `\`\`\`${printedCmds.join('\n')}\`\`\``);
		}

		return message.channel.send({ embed });
	} else {		//	Display info about the specified command
		const cmd = client.commands.get(command) || client.aliases.get(command);
		if (cmd) {
			let embed;
			if (embedCache.hasOwnProperty(command)) {
				embed = embedCache[command];
			} else { 
				const name = cmd.help.name;
				const category = cmd.help.category;
				const description = cmd.help.description;
				const usage = cmd.help.usage;
				const params = cmd.help.params || {};
				const examples = cmd.help.examples;
				const cooldown = cmd.conf.cooldown || 1.5;
				const globalCd = cmd.conf.globalCd || false;
				const aliases = cmd.conf.aliases || [];
	
				embed = new MessageEmbed()
					.setTitle(client.printCmd(name))
					.setColor(client.colors.brand)
					.setThumbnail(client.emojis.cache.find(e => e.name === 'caprineCommand').url)
					.setDescription(description + '‌	‌'.repeat(66 - description.length))
					.addField(aliases.length === 1 ? 'Alias' : 'Aliases', aliases.length > 0 ? aliases.join(', ') : 'None')
					.addField('Cooldown', ms(cooldown*1000, { long: true }), true)
					.addField('Global Cooldown', globalCd ? 'Yes' : 'No', true)
					.addField('Usage', client.printCmd(usage))
					.setFooter('This command is from the ' + category + ' category.');
				
				if (Object.keys(params).length !== 0) {
					let parameters = [];
	
					for (let p of Object.keys(params)) {
						const paramDescription = params[p];
						parameters.push(`\`${p}\`` + '	' + paramDescription);
					}
	
					embed.addField('Parameters', parameters.join('\n'));
				}
	
				let exampleLines = [];
				for (let example of examples) {
					exampleLines.push(client.printCmd(example));
				}

				embed.addField(examples.length > 1 ? 'Examples' : 'Example', `\`\`\`\n${exampleLines.join('\n')}\`\`\``);

				embedCache[command] = embed;
			}

			return message.channel.send({ embed });
		} else {
			return message.reply('That command does not exist.');
		}
	}
};

exports.conf = {
	enabled: true,
	aliases: [
		'halp',
		'cmds',
		'commands'
	],
	permLevel: 0
};

exports.help = {
	name: 'help',
	category: 'Info',
	description: 'Displays all the available commands for your permission level',
	usage: 'help [command?]',
	params: {
		'command?': '(Optional) Command to view details on'
	},
	examples: [
		'help',
		'help dice'
	]
};