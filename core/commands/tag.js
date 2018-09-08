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
	if (args.length < 0) return;
	const mysql = require('mysql');
	const arg1 = args[0];

	const queries = {
		check: "SELECT `id` FROM `tags` WHERE `name` = ?",
		create: "INSERT INTO tags (uid, creator, name, content, date) VALUES (?, ?, ?, ?, ?)",
		get: "SELECT `id`, `content` FROM `tags` WHERE `name` = ?",
		delete: "DELETE FROM `tags` WHERE `name` = ?"
	};
	
	//	User wants to create a tag, use second arg as tag name and everything after as the content
	if (arg1 === 'create') {
		try {
			const uuid = require('uuid/v4');
			const moment = require('moment');

			const creator = message.author.id;
			const tagName = args[1].toLowerCase();
			const tagContent = Buffer.from(args.slice(2).join(' ')).toString('base64');
			const date = moment().unix();

			if (tagName.length < 3) return message.reply('Tag name must be greater than 2 characters.');
			if (tagContent.length < 3) return message.reply('Tag content must be greater than 2 characters.');

			const db = mysql.createConnection(client.db);

			db.query(queries.check, [tagName], (e, r, f) => {
				if(e) console.log(e);
				if (r.length > 0) {
					return message.reply('That tag already exists.');
				} else {
					db.query(queries.create, [uuid().toUpperCase(), creator, tagName, tagContent, date], (e, r, f) => {
						if(e) return message.reply('Error creating tag!\n' + e);
						return message.reply('Tag created!');
					});
				}
			});
		} catch (error) {
			console.log(error);
		}
	} else if (arg1 === 'delete') {
		if (level < 5) return;

		const db = mysql.createConnection(client.db);
		const tagName = args[1].toLowerCase();

		db.query(queries.check, [tagName], (e, r, f) => {
			if(e) console.log(e);
			if (r.length > 0) {
				db.query(queries.delete, [tagName], (e, r, f) => {
					if(e) return message.reply('Error deleting tag!\n' + e);
					return message.reply('Tag deleted!');
				});
			} else {
				return message.reply('Tag does not exist.');
			}
		});
		
	} else {	//	Assume the first arg is the tag to look up
		const tagName = arg1.toLowerCase();
		if (tagName.length < 3) return message.reply('Tag name must be greater than 2 characters.');
		const db = mysql.createConnection(client.db);

		db.query(queries.get, [tagName], (e, r, f) => {
			if(e) return message.reply('Error checking tag!\n' + e);

			if (r.length < 1) return message.reply('Tag does not exist.');

			const tag = r[0];	//	Get first result since there will always be one result
			const content = Buffer.from(tag.content, 'base64').toString('ascii');

			return message.channel.send(`:label: #${tag.id}\n${content}`);
		});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
	deleteTrigger: false,
};

exports.help = {
	name: "tag",
	category: "Fun",
	description: "Create or retrieve tags. See extra info below for explanation.",
	usage: "dbtest",
	params: {
		"actionOrName": "Action to use with the command OR tag name to look up",
		"name?": "(Optional) Name of tag as a single word, only used when action is 'create' or 'delete'",
		"content?": "(Optional) Content of tag, only used when action is 'create' and a name is supplied"
	},
	examples: [
		"tag create depthbomb he is really cool!",
		"tag depthbomb"
	],
	extra_info: () => {
		return 'A tag is a single word with info attached to it. To create a tag, run !tag create <name> <info>. You can then retrieve info from that tag by its name with !tag <name>.';
	}
};