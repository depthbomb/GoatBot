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

const { MissingArgumentsError, InvalidArgumentsError, InsufficientPermissionsError } = require('@errors');
exports.run = async (client, message, args, level) => {
	throw new InsufficientPermissionsError(args.join(' ') || client.uuid());
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: 'assert',
	category: 'Dev',
	description: 'Test',
	usage: 'assert',
	params: {},
	examples: []
};