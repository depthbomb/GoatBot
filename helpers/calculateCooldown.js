/**
 * Calculates the cooldown to apply to a user based on various factors
 * @param {float} commandCooldown Command cooldown
 * @param {GuildMember} member Message guild member
 */
const calculateCooldown = (commandCooldown, member) => {
	let cooldown = 1.5;

	if (commandCooldown) {
		cooldown = commandCooldown;
	}

	if (member.premiumSince) {
		cooldown = Math.round(cooldown / 2);
	}

	return (cooldown * 1000);
};

module.exports = calculateCooldown;