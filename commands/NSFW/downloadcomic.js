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
const path = require('path');
const https = require('https');
const request = require('request');

const baseUrl      = 'https://yiffer.xyz';
const comicUrlBase = baseUrl + '/comics';
const apiUrlBase   = baseUrl + '/api/comics';

exports.run = async (client, message, args, level) => {
	if (args.length === 0) return;
	const inputComic = args.join(' ');
	const comicApiUrl = `${apiUrlBase}/${inputComic}`;
	const comicDownloadDir = path.join(client.dlPath, 'comics');

	let status = await message.channel.send('Sending request...');

	if (!fs.existsSync(comicDownloadDir)) fs.mkdir(comicDownloadDir, { recursive: true }, err => {});

	request(comicApiUrl, (err, res, body) => {
		if (err) return status.edit(err.message);
		const comicData = JSON.parse(body);
		if (comicData.error) return status.edit(comicData.error);
		const comicId  = comicData.comicId;
		const comicName = inputComic;
		const numPages = comicData.numberOfPages;
		const comicFolderName = `${comicId} - ${inputComic}`;
		const downloadPath = path.join(comicDownloadDir, comicFolderName);
		const zipName = path.join(comicDownloadDir, `${comicFolderName}.zip`);

		status.edit('Starting download...');

		fs.mkdir(downloadPath, { recursive: true }, err => {});

		let error;
		for (let i = 0; i < numPages; i++) {
			let $break = false;
			const pageFile = `${('00' + (i+1)).substr(-2, 2)}.jpg`;
			const pageUrl  = `${comicUrlBase}/${comicName}/${pageFile}`;
			const downloadDest = path.join(downloadPath, pageFile);
			const file = fs.createWriteStream(downloadDest);
			https.get(pageUrl, res => {
				res.pipe(file);
				file.on('finish', () => file.close());
			}).on('error', err => {
				fs.unlink(downloadDest);
				error = err;
				$break = true;
			});

			if ($break) break;
		}

		setTimeout(() => {
			if (error) {
				status.edit(error);
			} else {
				status.edit('Download complete, archiving folder...');
				compress.zip.compressDir(downloadPath, zipName)
				.then(() => status.edit('Operation complete!')
				).catch(err => status.edit(err.message));
			}
		}, 1000);
	});
};

exports.conf = {
	enabled: false,
	aliases: [
		'dlcomic',
		'yiffer'
	],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: 'downloadcomic',
	category: 'NSFW',
	description: 'Downloads a comic from Yiffer.xyz',
	usage: 'downloadcomic [comic]',
	params: {
		'comic': 'Comic name'
	},
	examples: [
		'downloadcomic Closet Case 2'
	]
};