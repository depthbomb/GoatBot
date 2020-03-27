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

const fs = require('fs');
const path = require('path');
module.exports = client => {
	return task = {
		name: 'clearTmp',
		description: 'Deletes temporary files',
		enabled: true,
		interval: 60*60*3,
		action: () => {
			const dir = client.tmpPath;
			fs.readdir(dir, (err, files) => {
				if (err) throw new Error(err);
				for (let file of files) {
					file = path.join(dir, file);
					fs.unlink(file, err => {
						console.log('Deleted temporary file', file);
					});
				}
			});
		}
	};
};