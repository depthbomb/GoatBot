/**
 * Checks bot config for changes and reloads it.
 */
module.exports = async (client) => {
	const path = require('path');
	return task = {
		interval: 60,
		action: () => {
			const oldConfig = JSON.stringify(client.config);
			const newConfig = JSON.stringify(require(path.join(client.rootPath, 'config.js')).config);

			if (oldConfig !== newConfig) {
				client.log('task', 'Config file has changes pending, reloading...');
				delete require.cache[path.join(client.rootPath, 'config.js')];
				client.config = require(path.join(client.rootPath, 'config.js')).config;
			} else {
				delete require.cache[path.join(client.rootPath, 'config.js')];
			}
		}
	};
};