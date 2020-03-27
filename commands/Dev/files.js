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

const fs = require('fs'), path = require('path'), plural = require('pluralize'), pretty = require('pretty-bytes');
const walkSync = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? walkSync(path.join(dir, file), filelist)
			: filelist.concat(path.join(dir, file));
	});
	return filelist;
};
const getFileSize = (file) => {
	const stats = fs.statSync(file);
	const bytes = stats['size'];
	return bytes;
};

exports.run = async (client, message, args, level) => {
	if(args.length === 0) return;
	const dirs = {
		tmp: client.tmpPath,
		logs: path.join(client.storagePath, 'logs'),
		tasks: path.join(client.rootPath, 'tasks'),
		events: path.join(client.rootPath, 'events'),
		commands: path.join(client.rootPath, 'commands'),
	};
	const directory = dirs[args.join(' ').trim()] || false;

	if (directory) {
		const files = walkSync(directory);
		if (files.length > 0) {
			let totalSize = 0;
			for (let file of files) totalSize = totalSize + getFileSize(file);
			return message.reply(`This directory contains **${plural('file', files.length, true)}** with a total size of **${pretty(totalSize)}**.`);
		} else {
			return message.reply('This directory does not have any files in it.');
		}
	} else {
		return message.reply('Invalid directory');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 2,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'files',
	category: 'Dev',
	description: 'Gets stats on a bot\'s system directory',
	usage: 'files [dir]',
	params: {
		'dir': 'Directory to list files of. Supports tmp, logs, and commands'
	},
	examples: [
		'files tmp'
	]
};