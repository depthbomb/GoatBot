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
module.exports = async (client) => {
	return task = {
		name: 'checkDatabase',
		description: 'Checks the integrity of the local database, restoring from a backup if needed',
		enabled: !client.localMode,
		interval: 45*60,
		action: () => {
			const backup          = path.join(client.storagePath, 'database', 'goat.db.bak');
			const database        = client.dbPath;
			const backupExists    = fs.existsSync(backup);
			const databaseIsValid = () => {
				try {
					client.db.get().value();
				} catch (e) {
					return false;
				}
				return true;
			};

			if (databaseIsValid()) {
				fs.copyFile(database, backup, err => {
					if (err) client.log('error', 'Unable to backup database, ignoring as current database is valid.');
				});
			} else {
				if (backupExists()) {
					fs.copyFile(backup, database, err => {
						if (err) throw err;
					});
				} else {
					throw new Error('Database is invalid and no backup could be found, manual action required.');
					client.destroy();
					process.exit(1);
				}
			}
		}
	};
};