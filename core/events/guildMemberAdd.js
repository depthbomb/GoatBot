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

module.exports = (client, member) => {
	const refugeeRole = member.guild.roles.find(r => r.name === 'Refugee').id;
	const memberRole = member.guild.roles.find(r => r.name === 'Member').id;

	const greetingChannel = member.guild.channels.find(c => c.id === client.config.greetingChannel);
	const refugeeChannel = member.guild.channels.find(c => c.id === '431266723736322048');
	const greeting = client.config.greetings.shuffle()[0].replace('{user}', `<@${member.id}>`);

	if (!member.user.bot) {
		greetingChannel.send(greeting);

		member.addRole(refugeeRole).then(mem => {
			if (!client.deported.includes(mem.id)) {
				client.log("bot", `Sending welcome DM to new user, ${member.user.tag}.`);
	
				mem.send(`**Hey, ${mem.user.username}!** Welcome to the Cyan.TF Discord server.\n\nYou may notice that you can't chat with the other users in the normal channels. For security and abuse reasons, you have been given a temporary role that separates you from the other users. But don't worry! You will automatically be given access to the rest of the server after 5 minutes. If you are lucky, an admin will give you the role quicker so you can jump right in!\n\nIn the mean time, you can send messages in the \`#refugee-camp\` channel. Also, make sure to read the rules and other info in the \`#rules\` channel at the top.\n\n_We are glad to have you in the server!\nHave fun!_`);
			
				/**
				* Remove the restricted role and give the user the member role after the provided delay
				*/
				setTimeout(() => {
					mem.removeRole(refugeeRole, 'Via GoatBot!');
					mem.addRole(memberRole, 'Via GoatBot!');
				}, (client.config.autoRoles.unrestrictDelay * 1000));
			} else {
				return refugeeChannel.send(`<@${member.id}>, you have been flagged as _deported_. This means that you are a former user or have left & joined frequently. You will not automatically be given the member role and must contact an admin directly to get your refugee role lifted.`);
			}
		}).catch(e => {
			throw new Error(e);
		});
	}

	client.log("event", `${member.user.tag} has joined ${member.guild.name}!`);
	client.logAction('User joined', `${member.user.tag} has joined ${member.guild.name}!`, client.colors.green, member.user.tag, member.user.avatarURL);
};