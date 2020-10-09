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

const fs = require('fs');
const releaseUrl  = 'https://api.github.com/repos/ytdl-org/youtube-dl/releases';
const versionFile = './storage/data/youtube-dl-version';
const binFile = './bin/youtube-dl.exe';
const getVersion = (string) => {
	const split = string.split('.');
	const year = split[0];
	const month = split[1];
	const day = split[2];

	return new Date(year, month, day);
};
module.exports = client => {
	return task = {
		name: 'updateYoutubeDL',
		description: 'Updates the youtube-dl binary if needed',
		enabled: true,
		interval: 60*60*2,
		action: () => {
			client.log.debug('Checking for a new version of youtube-dl...');
			(async () => {
				const currentVersion = fs.readFileSync(versionFile, { encoding: 'utf8' });
				const response   = await client.fetch(releaseUrl, { headers: { 'Authorization': 'token ' + client.config.apiKeys.github } });
				const json       = await response.json();
				const version    = json[0].tag_name;
				const needUpdate = getVersion(version) > getVersion(currentVersion);
				if (needUpdate) {
					client.log.info(`Updating youtube-dl to version ${version}`);
					const downloadUrl = `https://yt-dl.org/downloads/${version}/youtube-dl.exe`;
					const res = await client.fetch(downloadUrl);
					const exe = fs.createWriteStream(binFile);
					await new Promise((resolve, reject) => {
						res.body.pipe(exe);
						res.body.on('error', err => {
							client.log.error(err);
							reject(err);
						});
						exe.on('finish', () => {
							fs.writeFileSync(versionFile, version);
							resolve();
						});
					});
				}
			})();
		}
	};
};