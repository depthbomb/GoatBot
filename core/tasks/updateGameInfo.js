/**
 * Updates game info channels
 */
module.exports = async (client) => {
	const request = require('request');
	return task = {
		interval: 30,
		action: () => {
			let playerCat = client.channels.find(c => c.id == '556535349799550976');
			let mapCat    = client.channels.find(c => c.id == '556541946022068245');
			request('https://cyan.tf/api/gameinfo', (err, res, body) => {
				if (err) return console.log(err);
				const data = JSON.parse(body);
				if (data.results !== null) {
					if (playerCat.name !== data.results.playercount) playerCat.setName(data.results.playercount);
					if (mapCat.name !== data.results.servermap) mapCat.setName(data.results.servermap);
					return;
				} else {
					return;
				}
			});
		}
	};
};