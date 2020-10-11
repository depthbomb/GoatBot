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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const _ = require('console.table');
module.exports = (client, oldGuild, newGuild) => {
	const header = ['prop', 'old', 'new'];
	const body   = [
		['name', oldGuild.name, newGuild.name],
		['nameAcronym', oldGuild.nameAcronym, newGuild.nameAcronym],
		['iconURL', oldGuild.iconURL({ dynamic: true }), newGuild.iconURL({ dynamic: true })],
		['region', oldGuild.region, newGuild.region],
		['afkTimeout', oldGuild.afkTimeout, newGuild.afkTimeout],
		['verificationLevel', oldGuild.verificationLevel, newGuild.verificationLevel],
	];

	client.log.info(`Guild [${oldGuild.name}] was updated`);
	console.table(header, body);
};