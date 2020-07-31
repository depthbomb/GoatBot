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

exports.run = async (client, message, args, level) => {
	throw new Error('Exception thrown!');
};

exports.conf = {
	enabled: true,
	aliases: [
		'crash',
		'fuckingdie'
	],
	permLevel: 5,
};

exports.help = {
	name: 'exception',
	category: 'Dev',
	description: 'Intentionally throws an exception, useful for testing error catching and reporting',
	usage: 'exception',
	params: {},
	examples: [
		'exception'
	]
};