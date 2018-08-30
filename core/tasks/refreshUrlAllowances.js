/**
 * Refreshes URL allowances for users
 */
module.exports = async (client) => {
	const moment = require('moment-timezone');
	return task = {
		interval: 60,
		action: () => {
			if (!client.config.allowances.enabled) return;
			const allowances = client.allowances.links;
			const now = moment().format('X');

			for (const key of Object.keys(allowances)) {
				const user = allowances[key];
				if (user.expires < now) {
					delete allowances[key];
					console.log('Refreshing URL allowance for ', key);
				}
			};
		}
	};
};