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

exports.config = {
	botVersion: "1.0.0",
	clientSecret: "",
	token: "",

	//	Bot owner tag
	ownerName: "depthbomb#0163",

	//Bot owner ID
	ownerId: "133325534548590594",

	//	Command prefix
	prefix: "!",

	//	Username bot will use when it starts up
	botUsername: "GoatBot!",
	color: "#0097A7",

	//	The initial "game" the bot will be playing when started
	initialGame: "!help",

	//	Online status, supports online, idle, invisible, and dnd
	status: "online",

	//	User agent for requests
	userAgent: "GoatBot! Automaton by Caprine Logic - github.com/depthbomb/GoatBot",

	//	Primary guild ID
	mainGuild: "186978265557237762",

	//	Important role names
	roles: {
		admin: 'Cute Goat Overlord 🐐',
		mod: 'Moderator',
		donor: 'Donor',
		separated: 'Refugee',
		punished: 'Kenneled'
	},

	warnings: {
		kennel_threshold: 1,
		kick_threshold: 6,
		ban_threshold: 10
	},

	//	User IDs blacklisted from using the !nsfw command
	nsfwBlacklist: [
		'380927159604346881',
		'304414006876176393',
		'252527365396103170',
		'249807401052536833',
		'300409345886257152'
	],

	//	Channel ID used for logging actions
	logChannel: "428601004913590274",

	//	Segregation channel ID for new users
	refugeeChannel: "431266723736322048",

	//	Channel ID in which to send greetings
	greetingChannel: "437403529783803926",

	//	'Deported' user IDs will not be able to leave the refugee camp automatically and need to be approved manually
	deported_users: [
		"168137183805308928",
		"402157367757635585",
		"468522484182941717",
		"251915428203331584",
		"380927159604346881"
	],

	//	Crypto options
	crypto: {
		salt: "GoatBot!Salt",
		errorSalt: "stackTraceSalt__GOAT"
	},

	//	Cooldown options
	cooldowns: {
		//	Default cooldown in seconds, used if the command config does not specify a cooldown property
		default: 1.5,

		reduction: {
			donor: 0.45,
			admin: 0.9999
		}
	},

	//	Auto role options
	autoRoles: {},

	status: {
		//	Random "games" the bot will cycle through hourly
		statuses: [
			"Petting a goat",
			"Increasing Discount's incoming damage",
			"Drinking tap water",
			"Dividing by zero",
			"Browsing e621",
			"Bragging about mechanical keyboards",
	
			"Praying to the B͠͞ĺ̡́̕a̢͟c̡̢ķ̵̶͝͝ ̵̴̨̧́Ǵ̶̛͘͡o̧̨̡͟a̴̡̧͜͝t͢",
	
			"Hacking your IP address with HTML",
			"Snapping my Fortnite win",
			"Yiffing",
			"Accidentally crashing the server",
			"WoW for 16 hours a day",
			"Thinking of new quotes for this",
			"Changing map to surf_tf_japan_v1",
			"!help",
			"Making a furry inside joke",
			"a True Pacifist run",
			"is this Loss?"
		],

		//	Weights for the corresponding status "game", in case you want some to appear more often than others
		weights: [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1 ]
	},

	//	Greetings the bot will choose from, replaces {user} with a user mention
	greetings: [
		"{user} has joined us! Give them a warm welcome.",
		"Hey, {user} just joined! Let's bully them!",
		"*Notices {user}* OwO What's this?",
		"Everyone hide! {user}'s here!"
	],

	//	Timezone for log timestamps
	logTimezone: "America/Chicago",

	//	Steam-related options
	steam: {
		//	Steam Web API Key
		api_key: ""
	},

	//	Cleverbot API Key, no longer obtainable for free and you must purchase one
	cleverbot_api_key: "",

	wolfram_alpha_api_key: '',

	//	Imgur API credentials
	imgur: {
		username: "",
		password: "",
		client: "",
		secret: ""
	},

	//	Log types. Old code, avoid modification
	logTypes: [
		"msg",
		"event",
		"bot",
		"system",
		"warn",
		"error",
		"task",
		"debug"
	],

	//	Required directories. Old code, avoid modification
	directories: [
		"storage",
		"storage/database",
		"storage/cache",
		"storage/cache/rss",
		"storage/cache/sb",
		"storage/tmp",
		"storage/logs",
		"storage/logs/crash"
	]
};