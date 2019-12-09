exports.run = async (client, message, args, level) => {
	const { RichEmbed } = require('discord.js');
	let embed = new RichEmbed().setDescription('Testing...');
	const msg = await message.channel.send({ embed });
	embed = new RichEmbed()
		.setColor('RANDOM')
		.setDescription(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
	;

	return msg.edit({ embed });
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 0,
	deleteTrigger: true,
};

exports.help = {
	name: "ping",
	category: "Info",
	description: "It... like... pings. Then Pongs. And it\'s not Ping Pong.",
	usage: "ping",
	examples: [
		"ping"
	]
};