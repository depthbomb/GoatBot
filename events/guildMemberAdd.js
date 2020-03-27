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

const TempBan = require('@models/TempBan');
module.exports = (client, member) => {
	TempBan.findOne({ userId: member.id })
	.then(ban => {
		if (ban) {
			return member.kick('Member has an active tempban.').catch(err => {
				throw new Error(err);
			});
		}
	})
	.catch(err => {
		throw new Error(err);
	});
	const refugeeRole = member.guild.roles.cache.find(r => r.name === 'Refugee');
	const greetingChannel = member.guild.channels.cache.find(c => c.id === client.config.greetingChannel);
	const refugeeChannel = member.guild.channels.cache.find(c => c.id === '431266723736322048');
	const greeting = client.config.greetings.shuffle()[0].replace('{user}', `<@${member.id}>`);

	if (!member.user.bot) {
		greetingChannel.send(greeting);
		member.addRole(refugeeRole).then(mem => {
			client.log('bot', `Sending welcome DM to new user, ${member.user.tag}.`);
			refugeeChannel.send(`**Hey, ${mem.user.username}!** Welcome to the Cyan.TF Discord server.\n\n**You may notice that you can't see other users or channels. Do not worry!** For security and abuse reasons, you have been separated from other users and channels. If you are known in the community, you will be given access to the rest of the server quickly. If you aren't, however, you will need to get the admin's attention. Try pinging them (without spamming!) and explaining who you are.\n\nYou can send messages in the \`#refugee-camp\` channel, but a message will automatically be deleted 10 minutes after sending. Also, make sure to read the rules and other info in the \`#rules\` channel at the top.\n\n_We are glad to have you in the server!\nHave fun!_`);
		}).catch(e => {
			throw new Error(e);
		});
	}

	client.log('event', `${member.user.tag} has joined ${member.guild.name}!`);
	client.logAction('User joined', `${member.user.tag} has joined ${member.guild.name}!`, client.colors.green, member.user.tag, member.user.avatarURL({ dynamic: true }));
};