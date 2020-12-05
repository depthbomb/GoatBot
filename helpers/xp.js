const Chance = require('chance');
const chance = new Chance();
const levelProfileAuxillaryCache = {};
const LevelProfile = require('@models/LevelProfile');
const distribute = (message, client) => {
	const cleanContent   = message.cleanContent.trim();
	if (/^(<:.*:\d{18,}>\s?){1,}$/ig.test(cleanContent) || cleanContent === null || cleanContent.length < 2) return;
	const author = message.author;
	const userId = author.id;
	const channelId = message.channel.id;
	if (!levelProfileAuxillaryCache.hasOwnProperty(userId)) {
		const authorRoles = message.member?.roles?.cache;
		const xpRequired = client.config.levels.xpRequired;
		const roleRewards = client.config.levels.roles;
		const disallowedChannels = client.config.levels.disallowedChannels;
		const disallowedRoles = client.config.levels.disallowedRoles;
		const userRoles = authorRoles.array().map(r => r.id);
		const xpGranted = chance.bool({ likelihood: 3 }) ? 3 : 1;
		const delay = chance.integer({ min: 45, max: 90 });
		const touchAgain = client.timestamp() + delay;
		const guildRoles = message.guild.roles.cache;
		if (!disallowedChannels.includes(channelId) && !(disallowedRoles.some(r => userRoles.includes(r)))) {
			levelProfileAuxillaryCache[userId] = touchAgain;
			client.setTimeout(() => delete levelProfileAuxillaryCache[userId], delay * 1000);
			LevelProfile.findOne({ userId }, 'userId value multiplier touchAgain disabled', (err, profile) => {
				if (err) return client.error(message, err);
				if (profile && !profile.disabled && profile.touchAgain < client.timestamp()) {
					const existingXp = profile.value;
					const multiplier = profile.multiplier;
					const finalXp = Math.floor((existingXp + xpGranted) * multiplier);
					LevelProfile.updateOne({ userId }, { value: finalXp, touchAgain }, async (err, res) => {
						if (err) return client.error(message, err);
						if (xpGranted > 1) message.react('🌟');
						const rewardIndex = xpRequired.findIndex(x => x >= finalXp) - 1;
						if (rewardIndex >= 0) {
							const rank = (rewardIndex + 1);
							const roleToRewardId = roleRewards[rewardIndex];
							const roleToReward = guildRoles.find(r => r.id == roleToRewardId);
							const hasReward = userRoles.includes(roleToRewardId);
							if (!hasReward) {
								const announcement = client.config.levels.announcement.replace('{user}', `<@${userId}>`).replace('{rank}', rank).replace('{reward}', roleToReward.name);
								const announcementChannel = message.guild.channels.cache.find(c => c.id == client.config.levels.announcementChannel);

								await message.member.roles.add(roleToReward, 'Rank Up');
								const embed = new MessageEmbed()
									  .setColor(client.colors.yellow)
									  .setDescription(`🌟 ${announcement}`);
								return announcementChannel.send({ embed });
							}
						}
					});
				} else {
					LevelProfile.create({ userId, value: xpGranted, touchAgain }, (err, newProfile) => {
						if (err) return client.error(message, err);
					});
				}
			});
		}
	}
};

module.exports = { distribute };