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
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

const polls = {};

const { MessageEmbed } = require('discord.js');
const { InvalidArgumentError, InvalidArgumentCountError } = require('@errors');
exports.run = async (client, message, args, level) => {
	InvalidArgumentCountError.assert(args.length >= 1, 'You must supply a poll question.');

	const question = args.join(' ').trim() || null;

	InvalidArgumentError.assert(question !== null && question !== '', 'Poll question may not be empty or null.');

	
};

exports.conf = {
	enabled: true,
	cooldown: 5,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: 'poll',
	category: 'Server',
	description: 'Starts a poll with the supplied question',
	usage: 'poll [question]',
	params: {
		'question': 'Question to be asked in the poll. You will be asked to supply the poll choices after.'
	},
	examples: [
		'poll should everyone be banned?'
	]
};