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
	const fs = require('fs');
	const action = args[0];
	const option = args[1];

	if (action === "error") {
		return client.error(message, "This is a test error.\n" + Math.random()*Math.random()*9999285302)
	} else if (action === "trace") {
		const crypto = require('crypto');
		const algorithm = 'aes-256-cbc';

		let decipher = crypto.createDecipher(algorithm, client.config.crypto.errorSalt);
		let decrypted = decipher.update(option, "base64", "utf8");
		decrypted += decipher.final('utf8');

		message.reply("\n\n" + decrypted);
	} else if (action === "logTypes") {
		const logTypes = client.config.logTypes;

		logTypes.forEach(type => {
			client.log(type, `This is a test log entry for [${type}]`, false);
		});
	} else if (action === 'dumpCommands') {
		const json = `${client.rootPath}/commands.json`;
		fs.writeFile(json, JSON.stringify(client.commands.array(), null, 4), () => {
			message.reply(`Dumped commands to \`${json}\``);
		});
	} else {
		return;
	}
};

exports.conf = {
	enabled: true,
	cooldown: 1,
	aliases: [
		"dbg"
	],
	permLevel: 10,
};

exports.help = {
	name: "debug",
	category: "Dev",
	description: "General purpose debug command, creator-only",
	usage: "debug"
};