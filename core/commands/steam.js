/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
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

exports.run = async (client, message, args, level) => {
	if (!args) return;

	const SteamID = require('steamid');
	const { RichEmbed } = require('discord.js');
	const request = require('request');
	const cheerio = require('cheerio');
	const snekfetch = require('snekfetch');
	const fs = require('fs');
	const moment = require('moment');
	const action = args[0];
	const option = args[1];
	const option2 = args[2];
	const responseMessages = {
		valid: `SteamID \`%steamid%\` is valid!`,
		invalid: `SteamID \`%steamid%\` is not valid.`,
		invalidB: `SteamID \`%steamid%\` is _kinda_ valid. You forgot to add the brackets around the provided SteamID3, like so \`[%steamid%]\`.`
	};

	if (action === "validate" || action === "valid") {
		const steamID3Pattern = /([IUMGAPCgTcLa]):([0-4]):(\d{1,10}):([01])/;
		const inputSteamID = option;

		try {
			const sid = new SteamID(inputSteamID);

			if (sid.isValid()) {
				return client.msg(message, "green", "success", responseMessages.valid.replace(/%steamid%/g, inputSteamID));
			} else {
				return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));
			}
		} catch (err) {
			if (steamID3Pattern.test(inputSteamID)) {
				return client.msg(message, "red", "error", responseMessages.invalidB.replace(/%steamid%/g, inputSteamID));
			} else {
				return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));
			}
		}

	} else if (action === "summary" || action === "sum") {
		const inputSteamID = option;

		let msg = await message.channel.send("Contacting API...");
		let sid;

		try {
			//	The SteamID module will throw an error if the input is not a valid
			//	Steam ID. Catch any errors here and just say that the SteamID is
			//	invalid.
			sid = new SteamID(inputSteamID);
		} catch (err) {
			return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));
		}

		if (!sid.isValid()) {
			msg.delete();
			return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));
		}
		const communityId = sid.getSteamID64();
		const cachePath = `${client.storagePath}/cache/steam/summary_${communityId}.json`;
		const apiUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${client.config.steam.api_key}&steamids=${communityId}`;
		const personaStates = [
			"Offline",
			"Online",
			"Busy",
			"Away",
			"Snooze",
			"Looking to Trade",
			"Looking to Play"
		];
		const profileStates = [
			"Private",
			"Friends Only",
			"Public"
		];

		snekfetch.get(`https://steamcommunity.com/profiles/${communityId}`).then(result => {
			let $ = cheerio.load(result.text);	//	Load the profile page so we can get info the API doesn't provide
			let description = $('meta[name=Description]').attr('content');	//	Get the profile description from the page's meta tag since it has a cleaned version

			request({
				headers: {
					"User-Agent": client.config.userAgent
				},
				uri: apiUrl,
				method: 'GET'
			}, (err, res, body) => {
				if (err) {
					msg.delete();
					return client.error(message, err);
				}

				let data = JSON.parse(body).response.players[0];
				if (data.length < 1) return msg.edit("The response was empty, this is likely due to the wrong type of Steam ID being provided. Make sure the Steam ID you provide is a user ID.");

				let embed = new RichEmbed()
							.setTitle(data.personaname)
							.setURL(data.profileurl)
							.setThumbnail(data.avatarfull)
							.setDescription(description)
							.addField("Status", personaStates[data.personastate])

				//	Set the color of the embed based on persona state and whether they
				//	are ingame.
				if (data.personastate == 0) {	//	Offline
					embed
						.setColor("#898989")
						.addField("Last online", moment.unix(data.lastlogoff).format("M/D/YYYY"))
				} else if (data.personastate > 0 && !data.gameid) {	//	Online but not ingame
					embed
						.setColor("#57cbde")
				} else if (data.personastate > 0 && data.gameid) {	//	Online and ingame
					embed
						.setColor("#90ba3c")
				}

				if (data.communityvisibilitystate > 2) {	//	If public, try to get public-only data
					if (data.loccountrycode) {
						embed.addField("Location", `:flag_${data.loccountrycode.toLowerCase()}: ${data.loccountrycode}`);
					}

					if (data.realname) {
						embed.addField("Real Name", data.realname);
					}

					if (data.gameid) {
						let gameField = `[${data.gameextrainfo}](https://store.steampowered.com/app/${data.gameid})${data.gameserverip != undefined ? ` - [Join game](steam://connect/${data.gameserverip})` : ''}`
						embed.addField("Currently Playing", gameField, true)
					}

					embed.addField("Date created", moment.unix(data.timecreated).format("M/D/YYYY"))
				}

				embed.addField('\u200B', `[Send friend request](steam://friends/add/${data.steamid})`);

				msg.edit({ embed });
			});
		});
	} else if (action === "convert" || action === "con") {
		const inputSteamID = option;
		const toType = option2.toLowerCase();
		const validTypes = [
			"legacy",
			"steamid2",
			"steamid64",
			"community",
			"steamid3"
		];

		if (!validTypes.includes(toType)) return client.msg(message, "red", "error", `Invalid conversion type provided. Valid conversion types are \`${validTypes.join(', ')}\`.`);

		let sid;
		let final;

		try {
			sid = new SteamID(inputSteamID);
		} catch (err) {
			return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));
		}

		if (!sid.isValid()) return client.msg(message, "red", "error", responseMessages.invalid.replace(/%steamid%/g, inputSteamID));

		try {
			if (toType === "legacy" || toType === "steamid2") {
				final = sid.getSteam2RenderedID();
			} else if (toType === "steamid64" || toType === "community") {
				final = sid.getSteamID64();
			} else if (toType === "steamid3" || toType === "modern") {
				final = sid.getSteam3RenderedID();
			}
		} catch (e) {
			return client.msg(message, "red", "error", `I could not convert \`${inputSteamID}\` to \`${toType}\``);
		}

		return client.msg(message, "green", "success", `\`${inputSteamID}\` **⇨** \`${final}\``);
	} else {

	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "steam",
	category: "Info",
	description: "Steam super command",
	usage: "steam [action] [options?..]",
	params: {
		"action": "Action to use",
		"options": "(Optional) Option(s) to compliment the action. Some actions may or may not have options and some actions may require multiple options"
	},
	examples: [
		"steam validate [U:1:43436151]",
		"steam summary 76561198026398801",
		"steam convert STEAM_0:1:33066536 steamID64"
	]
};