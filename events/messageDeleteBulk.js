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

module.exports = (client, messages) => {
	const channel = messages.first().channel.name;
	let messageAuthors = [];

	for (let i = 0; i < messages.array().length; i++) {
		const msg = messages.array()[i];
		if (!messageAuthors.includes(msg.author.username)) messageAuthors.push(msg.author.username);
	}

	client.log.info(`${messages.array().length} messages by ${messageAuthors.join(', ')} have been deleted in ${channel}.`);
	client.logAction('Bulk message deletion', `${messages.array().length} messages by ${messageAuthors.join(', ')} have been deleted in ${channel}.`);
};