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

const { MessageEmbed } = require('discord.js');
const LevelProfile = require('@models/LevelProfile');
exports.run = async (client, message, args, level) => {
	let mention, member, self = false;
	if (args.length > 0) {
		mention = args.join(' ');
		if (mention.match(/<@!?\d{17,19}>/g)) {
			member = message.mentions.members.first();
		} else {
			member = message.guild.members.cache.find(m => m.id == mention);
		}
	} else {
		self = true;
		member = message.member;
	}

	if (member) {
		const xpRequired  = client.config.levels.xpRequired;
		const roleRewards = client.config.levels.roles;
		const totalRanks  = xpRequired.length;
		LevelProfile.findOne({ userId: member.id }, (err, profile) => {
			if (profile) {
				const xp          = profile.value;
				const nextRankXp  = xpRequired.find(x => x > xp);
				const nextRank    = message.guild.roles.cache.find(r => r.id == roleRewards[xpRequired.indexOf(nextRankXp)]).name;
				console.log('nextRank', nextRank);
				const currentRankIndex = xpRequired.findIndex(x => x >= xp) - 1;
				const currentRank = currentRankIndex > -1 ? message.guild.roles.cache.find(r => r.id == roleRewards[currentRankIndex]).name : 'None';
				const displayAvatarUrl = member.user.displayAvatarURL({ dynamic: true, size: 256 });
				const embed = new MessageEmbed()
					  .setTitle(`🌟 ${member.displayName}`)
					  .setColor(client.colors.yellow)
					  .setDescription(`You are currently rank **${currentRankIndex+1}/${totalRanks}**.`)
					  .addField('Current Rank', currentRank, true)
					  .addField('Next Rank', nextRank, true)
					  .setThumbnail(displayAvatarUrl)
					  .setTimestamp();

				const output  = Math.round((nextRankXp - xp) / ((nextRankXp + xp) / 2) * 100);
				if (output > -1) {
					const blocks  = Math.round(output / 10);
					const bar     = '█'.repeat(blocks * 5);
					const barFill = ' ​'.repeat((10 - blocks) * 5);
					embed.addField(`${xp}/${nextRankXp} XP`, `${output}% - \`${bar}${barFill}\``);
				}
		
				return message.channel.send({ embed });
			} else {
				if (self) {
					return message.reply('You are currently not ranked.');
				} else {
					return message.reply(member.displayName + ' is currently not ranked.');
				}
			}
		});
	} else {
		return message.reply('Could not find member.');
	}
};

exports.conf = {
	enabled: true,
	cooldown: 10,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'rank2',
	category: 'Levels',
	description: 'Shows your current level info',
	usage: 'rank [@mention?|user ID?]',
	params: {
		'@mention|user ID': '(Optional) Mention or user ID to retrieve the info on, otherwise you will be chosen'
	},
	examples: [
		'rank2',
		'rank2 @Username#0000'
	]
};