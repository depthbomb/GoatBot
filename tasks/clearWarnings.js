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

const Warning = require('@models/Warning');
module.exports = client => {
	return task = {
		name: 'clearWarnings',
		description: 'Clears outstanding outdated user warnings',
		enabled: true,
		interval: 60*60,
		action: () => {
			const now = client.timestamp();
			Warning.deleteMany({ expires: { $lte: now } }, err => {
				if (err) throw new Error(err);
			});
		}
	};
};