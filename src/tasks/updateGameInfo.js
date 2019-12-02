/**
 * Updates game info channels
 */
// module.exports = async (client) => {
// 	const request = require('request');
// 	const ssq = require('ssq');
// 	const AsciiTable = require('ascii-table');
// 	const ms = require('ms');
// 	return task = {
// 		interval: 30,
// 		action: () => {
// 			const serverIp = '66.150.188.17';
// 			const serverPort = 27015;

// 			const playerCat = client.channels.find(c => c.id == '556535349799550976');
// 			const mapCat    = client.channels.find(c => c.id == '556541946022068245');
// 			const playerChan = client.channels.find(c => c.id == '556551745036222467');

// 			request('https://cyan.tf/api/gameinfo', (err, res, body) => {
// 				if (err) return console.log(err);
// 				const data = JSON.parse(body);
// 				if (data.results !== null) {
// 					if (playerCat.name !== data.results.players) playerCat.setName(data.results.players);
// 					if (mapCat.name !== data.results.map) mapCat.setName(data.results.map);

// 					client.disableLog = true;

// 					let messageContent;

// 					ssq.players(serverIp, serverPort, (err, data) => {
// 						if (err) return client.error(message, err);

// 						if (data.length < 1) {	//	No players
// 							messageContent = '**No players ingame** Why not hop on?';
// 						} else {				//	Has players
// 							const players = data.sort(sortByKey('score', 'desc'));
// 							const table = new AsciiTable();
// 							table.setHeading('Name', 'Score', 'Time')
				
// 							players.forEach(user => {
// 								table.addRow(user.name !== '' ? user.name.trim() : '<Connecting...>', user.score, `${ms(Math.floor(user.duration * 1000))}`);
// 							});
				
// 							messageContent = `\`\`\`${table.toString()}\`\`\``;
// 						}

// 						playerChan.fetchMessages({ limit: 10 }).then(messages => {
// 							lastMessage = messages.first();
// 							lastMessage.clearReactions();
// 							lastMessage.edit(messageContent);
// 						});
// 					});

// 					client.disableLog = false;

// 					return;
// 				} else {
// 					client.disableLog = false;
// 					return;
// 				}
// 			});

// 			const sortByKey = (key, order = 'asc') => {
// 				return function (a, b) {
// 					if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
// 						// property doesn't exist on either object
// 						return 0;
// 					}
		
// 					const varA = (typeof a[key] === 'string') ?
// 						a[key].toUpperCase() : a[key];
// 					const varB = (typeof b[key] === 'string') ?
// 						b[key].toUpperCase() : b[key];
		
// 					let comparison = 0;
// 					if (varA > varB) {
// 						comparison = 1;
// 					} else if (varA < varB) {
// 						comparison = -1;
// 					}
// 					return (
// 						(order == 'desc') ? (comparison * -1) : comparison
// 					);
// 				};
// 			};
// 		}
// 	};
// };