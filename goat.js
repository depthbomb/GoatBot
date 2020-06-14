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

if (
	process.version.slice(1).split('.')[0] < 10 ||
	process.version.slice(1).split('.')[0] >= 10 && process.version.slice(1).split('.')[1] < 2
) throw new Error('GoatBot requires Node 10.2.0 or higher.');

require('module-alias/register');
const fs = require('fs');
const path = require('path');
const Listr = require('listr');
const log4js = require('log4js');
const moment = require('moment');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const Discord = require('discord.js');
const { promisify } = require('util');
const NodeCache = require('node-cache');
const readdir = promisify(require('fs').readdir);
const ascii = ["┌─────────────────────────────────────────────────────────────────────────┐",
				"│                                                                         │",
				"│                                                                         │",
				"│                 ______            __  ____        __  __                │",
				"│                / ____/___  ____ _/ /_/ __ )____  / /_/ /                │",
				"│               / / __/ __ \\/ __ `/ __/ __  / __ \\/ __/ /                 │",
				"│              / /_/ / /_/ / /_/ / /_/ /_/ / /_/ / /_/_/                  │",
				"│              \\____/\\____/\\__,_/\\__/_____/\\____/\\__(_)                   │",
				"│                                                                         │",
				"│                                                                         │",
				"│                                                                         │",
				"├─────────────────────────────────────────────────────────────────────────┤",
				"│            « Made by depthbomb#0163, powered by goat butts »            │",
				"└─────────────────────────────────────────────────────────────────────────┘"];
console.log(ascii.join('\n'));

class GoatBot extends Discord.Client {
	constructor (options) {
		super (options);
		this.db;
		this.log;

		this.config      = require('./config.js').config;

		this.disableLog  = false;
		this.online      = false;
		this.started     = 0;
		this.heartbeat   = 0;

		this.localMode   = this.config.dev;

		this.commands    = new Discord.Collection();
		this.aliases     = new Discord.Collection();
		this.tasks       = [];
		this.store       = { lockdowns: { } };

		this.raidMode    = false;

		this.rootPath    = __dirname;
		this.binPath     = path.join(this.rootPath, 'bin');
		this.storagePath = path.join(this.rootPath, 'storage');
		this.tmpPath     = path.join(this.storagePath, 'tmp');
		this.dbPath      = path.join(this.storagePath, 'database');
		this.cachePath   = path.join(this.storagePath, 'cache');
		this.dlPath      = path.join(this.storagePath, 'downloads');
		this.rsrcPath    = path.join(this.rootPath, 'resources');
		this.colors      = {
			brand:       '#ea005e',
			yellow:      '#ffb900',
			default:     '#99aab5',
			red:         '#e81123',
			orange:      '#f7630c',
			green:       '#10893e',
			blue:        '#0078d7',
			black:       '#111111'
		};

		this.cache     = new NodeCache({ checkperiod: 60 });
		this.uuid      = () => uuid();
		this.timestamp = () => Math.floor(new Date() / 1000);
		this.printCmd  = (commandName) => this.config.prefix + commandName;
		this.permLevel = (message) => {
			if (message.author.id === client.config.ownerId)
				return 5;

			const adminRole = message.member.roles.cache.find(r => r.id === client.config.roles.admin);
			const moderatorRole = message.member.roles.cache.find(r => r.id === client.config.roles.mod);
			const donorRole = message.member.roles.cache.find(r => r.id === client.config.roles.donor);
			
			if (donorRole && message.member.roles.cache.has(donorRole.id))
				return 1;
			if (moderatorRole && message.member.roles.cache.has(moderatorRole.id))
				return 2;
			if (adminRole && message.member.roles.cache.has(adminRole.id))
				return 3;

			return 0;
		};
	}
}

const client = new GoatBot();
	  client.started = client.timestamp();

require(`${client.rootPath}/utils.js`)(client);
require(`${client.rootPath}/prototypes.js`)(client);

const init = () => new Listr([
	{
		title: 'Setting up logging',
		task: () => {
			log4js.configure({
				appenders: {
					file: {
						type: 'file',
						filename: path.join(client.storagePath, 'logs', 'GoatBot.log'),
						maxLogSize: 1*1024*1024,
						backups: 1,
						compress: true,
						encoding: 'utf-8',
						mode: 0o0640,
						flags: 'w+'
					},
					out: {
						type: 'stdout'
					}
				},
				categories: {
					default: { appenders: ['file', 'out'], level: (client.localMode ? 'debug' : 'info') }
				}
			});

			client.log = log4js.getLogger('default');
		}
	},
	{
		title: 'Cleaning up tmp files',
		skip: () => {
			if (fs.readdirSync(client.tmpPath).length < 1) return 'No temporary files to clean up';
		},
		task: () => {
			fs.readdir(client.tmpPath, (err, files) => {
				if (err) throw new Error(err);
				for (let file of files) {
					file = path.join(client.tmpPath, file);
					fs.unlink(file, err => {
						if (err) throw new Error(err);
					});
				}
			});
		}
	},
	{
		title: 'Initializing database',
		task: () => {
			const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
			mongoose.connect(client.config.database.connectionString, options);
			client.db = mongoose.connection;
			client.db.on('error', err => {
				throw new Error(err);
			});
			client.db.once('open', () => {
				return 'Connected!';
			});
		}
	},
	{
		title: 'Loading commands',
		task: () => {
			const commandsRoot = path.join(client.rootPath, 'commands');
			const categories = fs.readdirSync(commandsRoot)
				  .filter(file => fs.statSync(path.join(commandsRoot, file)).isDirectory());
			for (let folder of categories) {
				const commandFiles = fs.readdirSync(`${client.rootPath}/commands/${folder}/`);
				for (let file of commandFiles) {
					try {
						const props = require(`${client.rootPath}/commands/${folder}/${file}`);
						if (props.conf.enabled) {
							if (file.split('.').slice(-1)[0] !== 'js') return;
							client.commands.set(props.help.name, props);
							props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
						}
					} catch (e) {
						throw new Error(e);
					}
				}
			}
		}
	},
	{
		title: 'Loading events',
		task: async () => {
			const eventFiles = await readdir(`${client.rootPath}/events/`);
			for (let file of eventFiles) {
				try {
					const eventName = file.split('.')[0];
					const event = require(`${client.rootPath}/events/${file}`);
					client.on(eventName, event.bind(null, client));
					delete require.cache[require.resolve(`${client.rootPath}/events/${file}`)];
				} catch (e) {
					throw new Error(e);
				}
			}
		}
	},
	{
		title: 'Loading tasks',
		task: async () => {
			const taskFiles = await readdir(`${client.rootPath}/tasks/`);
			for (let file of taskFiles) {
				try {
					const imported = require(`${client.rootPath}/tasks/${file}`)(client);
					const task = Promise.resolve(imported);
					task.then((t) => {
						if (t.enabled) {
							client.tasks.push(t);
							if (t.hasOwnProperty('start')) t.start();
							const storedTask = client.tasks[client.tasks.indexOf(t)];
							client.setInterval(() => {
								t.action();
								storedTask.lastRan = Math.floor(new Date() / 1000);
							}, (t.interval * 1000));
							storedTask.lastRan = 0;
						}
					});
					delete require.cache[require.resolve(`${client.rootPath}/tasks/${file}`)];
				} catch (e) {
					throw new Error(e);
				}
			}
		}
	}
])
.run()
.then(() => client.login(client.config.token))
.catch(err => {
	client.log.error(err);
	client.destroy();
	process.exit(1);
});

init();

/**
* Listen for CTRL+C and shut the bot down gracefully
*/
process.on('SIGINT', () => {
	client.log.info('Caught shutdown signal');
	client.destroy();
	client.log.info('Client destroyed, exiting...')
	process.exit(1);
});

process.on('uncaughtException', err => {
	const crashFile = path.join(client.storagePath, 'logs', 'crash', `EXCEPTION_${moment().format('M-D-YY')}.log`);
	const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	client.log.error('Uncaught Exception: ' + errorMsg);
	fs.appendFile(crashFile, 'Uncaught Exception: ' + errorMsg + '\n', () => {
		client.destroy();
		process.exit(1);
	});
});

process.on('unhandledRejection', err => {
	const crashFile = path.join(client.storagePath, 'logs', 'crash', `REJECTION_${moment().format('M-D-YY')}.log`);
	const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	client.log.error('Uncaught Promise Error: ' + errorMsg);
	fs.appendFile(crashFile, 'Uncaught Promise Error: ' + errorMsg + '\n', () => {
		client.destroy();
		process.exit(1);
	});
});