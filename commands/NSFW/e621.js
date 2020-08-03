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

const ratings = ['e', 'q', 's'];
const nsfwBlacklist = ['cub', 'young', 'pregnant', 'nezumi', 'mei_(one_stormy_night)'];	//	Tags that will be disallowed when using Q, E, and A ratings
const tagBlacklist = ['male_lactation', 'vore', 'inflation', 'gore', 'macro', 'scat', 'watersports', 'suicide', 'fag', 'abuse', 'imminent_death', 'loli', 'shota', 'diaper', 'urine', 'vomit',  'torture', 'necrophilia', 'castration', 'hyper', 'death_by_penis', 'obese', 'morbidly_obese', 'epilepsy_warning', 'feces', 'flatulence', 'fart', 'smegma', 'nightmare_fuel', 'cboy', 'incest', 'mutilation', 'cheese_grater', 'sensory_deprivation', 'permanent_bondage', 'flash', 'family_guy', 'death', 'what', 'advertisement', 'what_has_science_done', 'where_is_your_god_now', 'male_birth', 'male_pregnancy', 'puffy_anus', 'type:swf', 'type:webm', 'order:score_asc', 'swastika', 'nazi', '<30_second_webm', '>30_second_webm', 'no_sound'];

const trunc = require('truncate');
const request = require('request');
const { MessageEmbed } = require('discord.js');
const { MissingArgumentError, InvalidArgumentError, InvalidCommandLocationError } = require('@errors');
exports.run = async (client, message, args, level) => {
	MissingArgumentError.assert(args.length >= 3, 'You must provide three arguments');
	InvalidCommandLocationError.assert(message.channel.nsfw, 'This command can only be used in NSFW channels')

	const rating = args[0];

	InvalidArgumentError.assert(ratings.includes(rating), `The rating you provided is invalid. Valid ratings are **${ratings.join(', ')}**`);

	const pageNum = parseInt(args[1]);

	InvalidArgumentError.assert(pageNum !== NaN, 'Page number must be a number');
	InvalidArgumentError.assert(pageNum <= 750 && pageNum >= 1, 'Page number must be a between 1 and 750');

	let tags = args.slice(2).join(' ').toLowerCase().split(' ');

	let blacklistedTags = [...tagBlacklist];
	if (rating !== 's') {
		blacklistedTags = blacklistedTags.concat(nsfwBlacklist);
	}

	const hasBlacklistedTags = blacklistedTags.filter(t => tags.includes(t)).length > 0;

	InvalidArgumentError.assert(!hasBlacklistedTags, 'Your tags contain blacklisted terms');

	let maxAttempts = 5;
	let attempts = 0;
	const msg = await message.channel.send('Sending request...');
	const searchQuery = `tags=${tags.join(' ')}+rating:${rating}&limit=320&page=${pageNum}`;
	const apiUrl = `https://e621.net/posts.json?${searchQuery}`;

	request({
		headers: { 'User-Agent': 'GoatBot! Discord Automaton for Caprine Logic (depthbomb @ e621, depthbomb#0163 @ Discord)' },
		uri: apiUrl,
		method: 'GET'
	}, (err, res, body) => {
		if (err) return msg.edit('There was a problem when requesting API data. Please try again.');

		const b = body;
		let data;

		try {
			data = JSON.parse(b).posts;
		} catch (error) {
			return msg.edit('Invalid response from the e621 API. Is the website down?');
		}

		msg.edit('API data retrieved, processing...');

		const sendPost = (d) => {
			if (d.success && d.success === false) return msg.edit(`<@${message.author.id}>, Error: ` + d.message);
			if (d === undefined || d.length == 0) return msg.edit(`<@${message.author.id}>, No results for your query. Make sure the tags you used exist and are formatted correctly. If the tags are correct then try lowering the page number. If all else fails, then there might just not be any results for what you searched for.\n¯\\_(ツ)_/¯`);

			const selected = data.shuffle()[0];
			const postTags = selected.tags.general;
			const postHasBlacklistedTags = blacklistedTags.filter(t => postTags.includes(t)).length > 0;

			if (attempts < maxAttempts) {
				if (postHasBlacklistedTags) {
					attempts++;
					msg.edit(`Blacklisted tag(s) found in post, trying again in 1 second... (${attempts} out of ${maxAttempts})`);
					client.setTimeout(() => sendPost(data), 1000);
					return;
				} else {
					const embed = new MessageEmbed()
						.setAuthor('E621', 'https://e621.net/apple-touch-icon.png', 'https://e621.net/')
						.setImage(selected.file.url)
						.setDescription(`https://e621.net/post/show/${selected.id}`)
						.addField('Artist(s)', selected.tags.artist.length > 0 ? "`" + selected.tags.artist.join(', ') + "`" : 'unknown_artist')
						.setFooter(`${data.length < 320 ? data.length : '>' + data.length} results`)
						.setColor('#002d55');

						if (selected.description) {
							const desc = `${trunc(selected.description, 1000, {ellipsis: "..."})}`;
							embed.addField('Description', `${selected.description !== "" ? desc : '_No description_'}`)
						}

					return msg.edit(null, { embed });
				}
			} else {
				return msg.edit('Attempt limit reached. Please try again.');
			}
		};

		sendPost(data);
	});
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	globalCd: true,
	aliases: [
		'e6',
		'salt',
		'yiff'
	],
	permLevel: 0
};

exports.help = {
	name: 'e621',
	category: 'NSFW',
	description: 'Command for getting data from e621.net.',
	usage: 'e621 [rating] [page] [tags]',
	params: {
		'rating': 'Rating to look for, can be \'s\', \'q\', or \'e\'',
		'page': 'Page number to search in. Max of 750. You are likely to find no results in very high page numbers so stick to around 1 to 10',
		'tags': 'Tags used when finding posts'
	},
	examples: [
		'e621 s 2 fluffy',
		'e621 e 3 butt',
		'e621 q 1 goat cute'
	]
};