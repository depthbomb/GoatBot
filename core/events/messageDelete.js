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

module.exports = (client, message) => {
	//	Don't log our own messages
	if (message.author.id === client.user.id) return;

	let logMessage;
	let isAttachment = false;
	let attachmentWithMessage = false;
	if (typeof message.attachments.first() != 'undefined') isAttachment = true;
	if (isAttachment && message.content) attachmentWithMessage = true;

	if (message.embeds.length > 0) logMessage = `${message.author.username}'s embed(s) were deleted`;
	else if (isAttachment && !attachmentWithMessage) logMessage = `${message.author.username}'s attachment [${message.attachments.first().url}] was deleted`;
	else if (attachmentWithMessage) logMessage = `${message.author.username}'s attachment [${message.attachments.first().url}] with message [${message.content}] was deleted`;
	else logMessage = `${message.author.username}'s message [${message.content}] was deleted`;

	client.log("event", logMessage);
	client.logAction('Message deleted', logMessage, clientColors.default, message.author.tag, message.author.avatarURL);
};