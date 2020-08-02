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

const Filter = require('bad-words');
const filter = new Filter({ list: [ 'nigger', 'faggot', 'fag', 'kike', 'jew', 'chink' ] });
const Tag = require('@models/Tag');
const { MissingArgumentError, InvalidArgumentError } = require('@errors');
exports.run = async (client, message, args, level) => {
	const userId = message.author.id;
	MissingArgumentError.assert(args.length >= 1, 'This command requires at least one argument.');

	const tagName = args[0].trim();

	InvalidArgumentError.assert(!filter.isProfane(tagName), 'Your tag name contains inappropriate language.');

	if (args.length > 1) {
		const tagMessage = args.slice(1).join(' ').trim();

		InvalidArgumentError.assert(!filter.isProfane(tagMessage), 'Your tag message contains inappropriate language.');

		Tag.findOne({ name: tagName }, (err, tag) => {
			if (err) throw new Error(err);
			if (tag) {
				if (tag.userId == userId) {
					Tag.updateOne({ name: tagName }, { message: tagMessage }, (err, res) => {
						if (err) throw new Error(err);
						return message.reply('Tag has been updated!');
					});
				} else {
					return message.reply('You may only update tags that you created.');
				}
			} else {
				Tag.create({ userId, name: tagName, message: tagMessage, createdAt: client.timestamp() }, (err, tag) => {
					return message.reply(`Tag has been created for \`${tag.name}\`!`);
				});
			}
		});
	} else {
		Tag.findOne({ name: tagName }, (err, tag) => {
			if (err) throw new Error(err);
			if (tag) {
				return message.channel.send(tag.message);
			} else {
				return message.reply(`Tag for \`${tagName}\` does not exist.`);
			}
		});
	}
};

exports.conf = {
	enabled: true,
	cooldown: 3,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'tag',
	category: 'Tags',
	description: 'Adds/updates a tag if you provide a second argument otherwise displays a tag\'s message if it exists',
	usage: 'tag [name] [message?]',
	params: {
		'name': 'Name of the tag, will automatically trim spaces around it and be converted to lowercase',
		'message?': 'Message attached to the reminder'
	},
	examples: [
		'tag hello world',
		'tag hello'
	]
};