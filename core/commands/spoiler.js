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

exports.run = (client, message, args, level) => {
	if (!args) return;

	const crypto = require('crypto');
	const algorithm = 'aes-256-cbc';
	const key = "cyanbot_spoiler_command_key1";

	let topic = args[0];
	let spoiler = args.slice(1).join(" ");

	let cipher = crypto.createCipher(algorithm, key);
	let encrypted = cipher.update(spoiler, "utf8", "base64");
	encrypted += cipher.final('base64');

	let messageContent = `<@${message.author.id}> sent a spoiler for: \`${topic.replace(/-/g, ' ')}\` - _react with :eyes: to decode_\n\n\`${encrypted}\``;

	message.delete();

	message.channel.send(messageContent).then((msg) => {
		msg.react('👀');

		const collector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '👀' && user.id != client.user.id,
			{ time: 3600000 }
		);

		let sentUsers = [];
		let verb = sentUsers.length <= 1 ? "has" : "have";

		collector.on('collect', (r) => {
			let reactionUser = r.users.last();	//	To get the latest user that reacted
			let reactionUserMention = `<@${reactionUser.id}>`;
			if (!sentUsers.includes(reactionUserMention)) {
				sentUsers.push(reactionUserMention);
				reactionUser.send(`Spoiler for \`${topic.replace(/-/g, ' ')}\`:\n\n\`${spoiler}\``).then(() => {
					if (sentUsers.length > 0) {
						msg.edit(messageContent.concat(`\n\n${sentUsers.join(", ")} ${verb} read this spoiler.`));
					}
				});
			}
		});
		collector.on('end', collected => {
			msg.edit(messageContent.concat(`\n\n${sentUsers.join(", ")} ${verb} read this spoiler.\n\n***This spoiler has expired.***`));
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"spoil"
	],
	permLevel: 0
};

exports.help = {
	name: 'spoiler',
	category: 'Info',
	description: 'TODO',
	usage: "spoiler [topic] [message]",
	params: {
		"topic": "Topic of your spoiler, used to let others know what the spoiler pertains to. Use dashes instead of spaces",
		"message": "The spoiler message itself"
	},
	examples: [
		"spoiler My-Topic Everybody dies!"
	]
};