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
	if(args.length < 1) return;
	const code = args.join(" ");

	try {
		const start = process.hrtime();
		let execTime = process.hrtime(start);
		let evaled = eval(code);
		const clean = await client.clean(client, evaled);

		if (typeof evaled !== "string") {
			evaled = require("util").inspect(evaled);
		}

		return;

	} catch (err) {
		return message.reply(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 2,
	aliases: [
		"ev2"
	],
	permLevel: 10
};

exports.help = {
	name: "eval2",
	category: "System",
	description: "Evaluates arbitrary JavaScript code, but without output.",
	usage: "eval2 [code]",
	params: {
		"code": "JavaScript code to evaluate"
	},
	examples: [
		"eval2 ['test', 'test2'].join(', ')"
	]
};