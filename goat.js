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

const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
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
console.log(chalk.bgCyan.whiteBright(ascii.join("\n")));

const low = require('lowdb'),
	  FileSync = require('lowdb/adapters/FileSync');

class GoatBot extends Discord.Client {
	constructor (options) {
		super (options);
		this.online = false;

		//	Local mode (or dev mode) means that the bot is running locally on my development machine
		//	rather than a server.
		this.localMode = process.platform === 'win32';
		this.config    = require("./config.js").config;

		this.commands = new Discord.Collection();
		this.aliases  = new Discord.Collection();
		this.tasks    = [];

		this.disableLog = false;
		this.heartbeat  = Math.floor(new Date() / 1000);

		this.rootPath    = __dirname;
		this.appPath     = `${this.rootPath}/src`;
		this.storagePath = `${this.rootPath}/storage`;
		this.tmpPath     = `${this.storagePath}/tmp`;
		this.dbPath      = `${this.storagePath}/database/db.goat`;
		this.cachePath   = `${this.storagePath}/cache`;
		
		this.colors = {
			brand:		this.config.color,
			yellow:		'#ffb901',
			default:	'#99aab5',
			red:		'#e81123',
			orange:		'#f7630d',
			green:		'#10883e',
			blue:		'#0078d7',
			black:		'#222222'
		};

		this.timestamp = () => Math.floor(new Date() / 1000);
		this.printCmd = (commandName) => this.config.prefix + commandName;
	}

	permlevel (message) {
		let permlvl = 0;

		//	Bot owner always has highest perm
		if (message.author.id === client.config.ownerId) return 10;

		// Set perm to 0 if webhook or DM
		if (!message.guild || !message.member || message.channel.type === "dm") return 0;

		try {
			const moderatorRole = message.member.roles.find(r => r.id === client.config.roles.mod);
			if (moderatorRole && message.member.roles.has(moderatorRole.id)) permlvl = 2;
		} catch (e) {
			client.log('warn', 'Moderator role is not present. Skipping level 2 check.');
		}

		try {
			const adminRole = message.member.roles.find(r => r.id === client.config.roles.admin);
			if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 3;
		} catch (e) {
			client.log('warn', 'Admin role is not present. Skipping level 3 check.');
		}

		return permlvl;
	}

	log (type, message, writeFile = !client.localMode) {
		let logName = type + '.log';
		let logMsg = `[${moment().tz(client.config.logTimezone).format('M/D/YY HH:mm:ss')}] [${type}] ${message}`;
		let logEntry = "\n" + logMsg;
		let logAsFile = ['msg', 'event', 'bot', 'system', 'warn', 'error', 'task', 'debug'];

		switch (type) {
			case 'msg':
				console.log(chalk.yellowBright(logMsg));
				break;
			case 'event':
				console.log(chalk.magentaBright(logMsg));
				break;
			case 'system':
				console.log(chalk.bgBlueBright.whiteBright(logMsg));
				break;
			case 'warn':
				console.log(chalk.bgYellowBright.black(logMsg));
				break;
			case 'error':
				console.log(chalk.bgRedBright.whiteBright(logMsg));
				break;
			case 'task':
				console.log(chalk.bgMagentaBright.whiteBright(logMsg));
				break;
			case 'debug':
				console.log(chalk.bgBlackBright.whiteBright(logMsg));
				break;
			case 'bot':
			default:
				console.log(chalk.cyanBright(logMsg));
				break;
		}

		if (logAsFile.includes(type) && writeFile) {
			const logFile = `${client.storagePath}/logs/${logName}`;
			if (!fs.existsSync(logFile)) fs.writeFile(logFile, "", () => {});
			fs.appendFile(logFile, logEntry, (err) => {
				if (err) throw new Error(err);
			});
		}
	}
}

const client = new GoatBot();

require(`${client.appPath}/functions.js`)(client);

const init = async () => {
	const adapter = new FileSync(client.dbPath);
	client.db = low(adapter);
	client.db.defaults({ warnings: [], reminders: [], bans: { user: [], reaction: [] } }).write();


	['Dev', 'Games', 'Info', 'Moderation', 'NSFW', 'Random', 'Reminders', 'Useful'].forEach(folder => {
		const commandFiles = fs.readdirSync(`${client.appPath}/commands/${folder}/`);
		console.log(chalk.greenBright(`Loading ${commandFiles.length} commands in ${folder}...`));
		commandFiles.forEach(f => {
			try {
				const props = require(`${client.appPath}/commands/${folder}/${f}`);
				if (props.conf.enabled) {
					if (f.split(".").slice(-1)[0] !== "js") return;
					client.commands.set(props.help.name, props);
					props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
				}
			} catch (e) {
				console.trace(e);
				process.exit(1);
			}
		});
	});


	/**
	* Load events
	*/
	const eventFiles = await readdir(`${client.appPath}/events/`);
	console.log(chalk.greenBright(`Loading ${eventFiles.length} events...`));
	eventFiles.forEach(file => {
		try {
			const eventName = file.split(".")[0];
			const event = require(`${client.appPath}/events/${file}`);
			client.on(eventName, event.bind(null, client));
			delete require.cache[require.resolve(`${client.appPath}/events/${file}`)];
		} catch (e) {
			console.trace(e);
			process.exit(1);
		}
	});
	/* ===================================================== */


	/**
	* Load tasks
	*/
	const taskFiles = await readdir(`${client.appPath}/tasks/`);
	console.log(chalk.greenBright(`Loading ${taskFiles.length} tasks...`));
	taskFiles.forEach(file => {
		try {
			const imported = require(`${client.appPath}/tasks/${file}`)(client);
			const task = Promise.resolve(imported);
			task.then((t) => {
				if (t.enabled) {
					client.tasks.push(t);
					if (t.hasOwnProperty('start')) t.start();
					const storedTask = client.tasks[client.tasks.indexOf(t)];
					setInterval(() => {
						t.action();
						storedTask.lastRan = Math.floor(new Date() / 1000);
					}, (t.interval * 1000));
					storedTask.lastRan = 0;
				}
			});
			delete require.cache[require.resolve(`${client.appPath}/tasks/${file}`)];
		} catch (e) {
			console.trace(e);
			process.exit(1);
		}
	});
	/* ===================================================== */


	/**
	* Log the bot into its account
	*/
	client.login(client.config.token);
	/* ===================================================== */
};


init();


/**
* Listen for CTRL+C and shut the bot down gracefully
*/
process.on('SIGINT', () => {
	console.log(`\n${chalk.bgRedBright.whiteBright('Caught shutdown signal')}`);
	client.destroy().then(() => {
		console.log(`${chalk.bgYellowBright.whiteBright('Client destroyed, exiting...')}`);
		process.exit(1);
	}).catch(err => {
		console.log("Caught error when destroying client, shutting down anyways...", err);
		process.exit(1);
	});
});

process.on('uncaughtException', err => {
	const crashFile = path.join(client.storagePath, 'logs', 'crash', `EXCEPTION_${moment().tz(client.config.logTimezone).format('M-D-YY')}.log`);
	const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
	console.error("Uncaught Exception: ", errorMsg);
	fs.appendFile(crashFile, "Uncaught Exception: " + errorMsg + '\n', (err) => {
		client.destroy();
		process.exit(1);
	});
});

process.on('unhandledRejection', err => {
	const crashFile = path.join(client.storagePath, 'logs', 'crash', `REJECTION_${moment().tz(client.config.logTimezone).format('M-D-YY')}.log`);
	const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
	console.error("Uncaught Promise Error: ", errorMsg);
	fs.appendFile(crashFile, "Uncaught Promise Error: " + errorMsg + '\n', (err) => {
		client.destroy();
		process.exit(1);
	});
});
/*
* We exit after logging so that PM2 will restart the bot automatically
**/