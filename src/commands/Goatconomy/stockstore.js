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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const StoreItem = require('@models/StoreItem');
exports.run = async (client, message, args, level) => {
	const stock = client.config.store.stock;
	const stockIds = stock.map(s => s.itemId);
	let storeIds = await StoreItem.find({ itemId: { $in: stockIds } }, '-_id itemId').exec();
		storeIds = storeIds.map(s => s.itemId);

	const missing = stockIds.filter(i => !storeIds.includes(i));

	if (missing.length > 0) {
		let msg = await message.channel.send(`Found ${missing.length} missing item(s), restocking...`);

		for (let item of missing) {
			const itemToStock = stock.filter(s => s.itemId === item);
			StoreItem.create(itemToStock).then(doc => {
				console.log('Added item', itemToStock, 'to store');
				
			}).catch(err => {
				throw new Error(err);
			});
			await client.wait(250);
		}
	
		return msg.edit(`Added ${missing.length} missing item(s)!`);
	} else {
		return message.reply('All store items are up to date!');
	}
};

exports.conf = {
	enabled: false,
	cooldown: 5,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: 'stockstore',
	category: 'Goatconomy',
	description: 'Stocks the store with items from the config (if they aren\'t already stocked)',
	usage: 'stockstore',
	params: {},
	examples: [
		'stockstore'
	]
};