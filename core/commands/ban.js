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
	if (args.length > 2 || args.length < 1) return;

	const arg1 = args[0];
	const banReason = args.slice(1).join(" ");

	let reason;

	if(arg1.match(/<@!?\d{17,19}>/g)) {
		const targetUser = message.mentions.users.first();

		if (message.guild.member(targetUser).bannable) {
			if (banReason.length < 1) reason = "<No reason specified>";
			else reason = banReason;

			message.guild.ban(targetUser, {days: 7, reason}).then(gm => {
				message.delete().then(msg => {
					msg.reply(`${targetUser.tag} has been banned:\n\`\`\`${reason}\`\`\``);
				}).catch(e => {
					console.log(e);	
				});
			}).catch(e => {
				console.log(e);
			});
		} else {
			return message.reply('I cannot ban that user.');
		}
	} else {
		return message.reply('Could not find user.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 1.5,
	globalCd: false,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "ban",
	category: "Moderation",
	description: "Bans a user",
	usage: "ban [@user] [reason?]",
	params: {
		'@user': 'User mention to ban',
		'reason?': '(Optional) Reason to attach to the ban',
	},
	examples: [
		"ban 133325534548590594 Spamming",
		"ban @UserName#0000",
	]
};