/**
 * Changes the bot's "playing" game
 */
module.exports = async (client) => {
	const Chance = require('chance');
	const chance = new Chance();
	return task = {
		interval: (60 * 60),
		action: () => {
			if (client.localMode) return;
			const quote = chance.weighted(client.config.status.statuses, client.config.status.weights);
			client.user.setPresence({
				status: "online",
				afk: false,
				game: {
					name: quote,
					type: 0
				}
			});
		}
	};
};