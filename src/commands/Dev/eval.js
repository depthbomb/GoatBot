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

const trunc = require('truncate');
exports.run = async (client, message, args, level) => {
	if(args.length === 0) return;
	const code = args.join(' ');

	try {
		const start = process.hrtime();
		const execTime = process.hrtime(start);
		let evaled = eval(code);
		let clean = await client.clean(client, evaled);

		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

		if (clean.length > 1999)
			clean = trunc(clean, 1800);

		return message.channel.send(`\:inbox_tray: Input:\n\`\`\`js\n${code}\`\`\`\n\:outbox_tray: Output:\n\`\`\`js\n${clean}\`\`\`\n_Executed in ${(execTime[1] / 1000000)}ms_`);
	} catch (err) {
		return message.reply(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
	}
};

exports.conf = {
	enabled: true,
	cooldown: 2,
	aliases: [
		"ev"
	],
	permLevel: 10
};

exports.help = {
	name: "eval",
	category: "Dev",
	description: "Evaluates arbitrary JavaScript code.",
	usage: "eval [code]",
	params: {
		"code": "JavaScript code to evaluate"
	},
	examples: [
		"eval ['test', 'test2'].join(', ')"
	]
};