exports.run = async (client, message, args, level) => {
	const { MessageEmbed } = require('discord.js');
	let embed = new MessageEmbed().setDescription('Testing...');
	const msg = await message.channel.send({ embed });
	embed = new MessageEmbed()
		.setColor('RANDOM')
		.setDescription(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
	;

	return msg.edit({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: 'ping',
	category: 'Info',
	description: 'Get my ping info',
	usage: 'ping',
	examples: [
		'ping'
	]
};