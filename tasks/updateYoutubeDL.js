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

const exec = require('execa');
const command = './bin/youtube-dl.exe -U';
const arguments = '-U';
module.exports = client => {
	return task = {
		name: 'updateYoutubeDL',
		description: 'Updates the youtube-dl binary if needed',
		enabled: true,
		interval: 60*60*3,
		action: async () => {
			client.store.lockytdl = true;
			let { stdout } = await exec(command, arguments);
			stdout = stdout.trim();
			client.store.lockytdl = false;
		}
	};
};