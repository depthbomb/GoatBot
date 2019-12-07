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

module.exports = (client, oldMember, newMember) => {
	const Table = require('cli-table2');
	const table = new Table({head: ['', 'Old', 'New'], style: {head:[]}});

	let oldRolesArray = [];
	let newRolesArray = [];

	oldMember.roles.forEach(role => {
		oldRolesArray.push(role.name);
	});
	newMember.roles.forEach(role => {
		newRolesArray.push(role.name);
	});

	table.push(
		{"Name": [oldMember.displayName, newMember.displayName]},
		{"Roles": [oldRolesArray.join(", "), newRolesArray.join(", ")]},
		{"Color": [oldMember.displayHexColor, newMember.displayHexColor]}
	);

	client.log('event', `${oldMember.displayName} was updated in ${oldMember.guild.name}:`);
	console.log(table.toString());
};