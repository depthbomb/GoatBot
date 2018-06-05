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

module.exports = (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot || oldMessage.channel.type === 'dm') return;
	if (newMessage.content === "!snip" || newMessage.content === "!s") oldMessage.delete();

	if (oldMessage.content != newMessage.content) {
		client.log("event", `${oldMessage.author.username}'s message was updated in ${oldMessage.channel.name}: [${oldMessage}] --> [${newMessage}]`);
		client.logAction('Message updated', `${oldMessage.author.username}'s message was updated:\n\n[${oldMessage}] --> [${newMessage}]`, clientColors.default, oldMessage.author.tag, oldMessage.author.avatarURL);
	}
};