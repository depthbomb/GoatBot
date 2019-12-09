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

exports.run = (client, message, args, level) => {
	if (!args) return;
	const atob = require('atob');
	const btoa = require('btoa');
	const zalgo = require('to-zalgo');
	const dezalgo = require('to-zalgo/banish');
	const crypto = require('crypto');
	const algorithm = 'aes-256-cbc';

	const action = args[0];	//	Action
	const arg1 = args[1];	//	Option or string
	const arg2 = args[2];	//	Option or string

	if (action === "emojify" || action === "emoji") {
		const string = args.slice(1).join(" ").toLowerCase().trim();
		const charConverter = {
			"a": "🇦","b": "🅱️","c": "🇨","d": "🇩","e": "🇪","f": "🇫","g": "🇬","h": "🇭","i": "🇮","j": "🇯","k": "🇰","l": "🇱","m": "🇲","n": "🇳","o": "🇴","p": "🇵","q": "🇶","r": "🇷","s": "🇸","t": "🇹","u": "🇺","v": "🇻","w": "🇼","x": "🇽","y": "🇾","z": "🇿","$": "💲","1": "1️⃣","2": "2️⃣","3": "3️⃣","4": "4️⃣","5": "5️⃣","6": "6️⃣","7": "7️⃣","8": "8️⃣","9": "9️⃣","0":"0️⃣","#": "#️⃣","*": "*️⃣ "," ": "  "
		};
		const outputArray = [];

		try {
			for (let i = 0, len = string.length; i < len; i++) {
				outputArray.push(charConverter[string[i]]);
				if (string.length - 1 === i) {
					let output = outputArray.join(" ");
					if (output.length > 2000) return client.msg(message, "red", "error", "The output message would be too long for me to send. Discord only allows 2000 characters per message.");
					return message.reply(`Here is your Emoji message!\n\`\`\`\n${output}\n\`\`\``);
				}
			}
		} catch (e) {
			return client.error(message, e);
		}
	} else if (action === "owo") {
		const string = args.slice(1).join(" ").trim();
		let output = string;
		output = output.replace(/(?:r|l)/g, "w");
		output = output.replace(/(?:R|L)/g, "W");
		output = output.replace(/n([aeiou])/g, 'ny$1');
		output = output.replace(/N([aeiou])/g, 'Ny$1');
		output = output.replace(/N([AEIOU])/g, 'Ny$1');
		output = output.replace(/ove/g, "uv");

		return message.reply(`What's this?\n\`\`\`\n${output}\n\`\`\``);
	} else if (action === "reverse" || action === "rev") {
		const string = args.slice(1).join(" ").trim();
		let output = string.split("").reverse().join("");
		return message.reply(`Here is your reversed message!\n\`\`\`\n${output}\n\`\`\``);
	} else if (action === "encrypt" || action === "enc") {
		const key = generateKey();
		const string = args.slice(1).join(" ").trim();

		function generateKey() {
			let text = "";
		    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz0123456789-_";
		    for (let i = 0; i < 43; i++)
		      text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return "!" + text;
		}

		let cipher = crypto.createCipher(algorithm, key);
		let encrypted = cipher.update(string, "utf8", "base64");
		encrypted += cipher.final('base64');

		return message.reply(`Here is your encrypted message and key! Combine them into a single string for decryption.\n\`\`\`asciidoc\nString :: ${encrypted}\nKey    :: ${key}\n\`\`\``);
	} else if (action === "decrypt" || action === "dec") {
		const string = args.slice(1).join(" ").replace(/\s/g, "").trim();
		const stringRegex = /([a-zA-Z0-9\/+=]+)(\![a-zA-Z0-9-_]{43})/;

		if (!string.match(stringRegex)) return client.msg(message, "red", "error", "You must provide both an encrypted string and a key to decrypt.");

		const encrypted = string.match(stringRegex)[1];
		const key = string.match(stringRegex)[2];

		let decipher = crypto.createDecipher(algorithm, key);
		let decrypted = decipher.update(encrypted, "base64", "utf8");
		decrypted += decipher.final('utf8');

		return message.reply(`Here is your decrypted message!\n\`\`\`\n${decrypted}\n\`\`\``);
	} else if (action === "hash") {
		const algo = arg1;
		const toHash = args.slice(2).join(" ");
		const algos = [
			'md4',
			'md5',
			'sha',
			'sha1',
			'sha256',
			'sha384',
			'sha512',
			'whirlpool'
		];

		if(!algos.includes(algo)) return client.msg(message, "red", "error", `Invalid hashing algorithm provided. Valid algorithms are ${algos.join(", ")}.`);

		let hash = crypto.createHash(algo).update(toHash);
		let output = hash.digest('hex');

		return message.reply(`Here is your hashed message!\n\`\`\`\n${output}\n\`\`\``);
	} else if (action === "encode") {
		const encoding = arg1;
		const toEncode = args.slice(2).join(" ");
		const validEncodings = [
			'base64',
			'b64',
			'url',
			'uri',
			'html',
			'zalgo'
		];

		if(!validEncodings.includes(encoding)) return client.msg(message, "red", "error", `Invalid encoding type provided. Valid encoding types are ${validEncodings.join(", ")}.`);

		let encoded;

		if (encoding === 'base64' || encoding === 'b64') encoded = btoa(toEncode);
		if (encoding === 'url' || encoding === 'uri') encoded = encodeURIComponent(toEncode);
		if (encoding === 'zalgo') encoded = zalgo(toEncode);

		return message.reply(`Here is your encoded message!\n\`\`\`\n${encoded}\n\`\`\``);
	} else if (action === "decode") {
		const encoding = arg1;
		const toDecode = args.slice(2).join(" ");
		const validEncodings = [
			'base64',
			'b64',
			'url',
			'uri',
			'zalgo'
		];

		if(!validEncodings.includes(encoding)) return client.msg(message, "red", "error", `Invalid encoding type provided. Valid encoding types are ${validEncodings.join(", ")}.`);

		let decoded;

		if (encoding === 'base64' || encoding === 'b64') decoded = atob(toDecode);
		if (encoding === 'url' || encoding === 'uri') decoded = decodeURIComponent(toDecode);
		if (encoding === 'zalgo') decoded = dezalgo(toDecode);

		return message.reply(`Here is your encoded message!\n\`\`\`\n${decoded}\n\`\`\``);
	} else {
		return;
	}
};

exports.conf = {
	enabled: true,
	cooldown: 2,
	aliases: [
		"str"
	],
	permLevel: 0
};

exports.help = {
	name: 'string',
	category: 'Fun',
	description: 'Super command to modify text in numerous ways.',
	usage: "string [action] [..options] [string]",
	params: {
		"action": "Action to use on the string",
		"options..": "Options to compliment the action. Some actions will not have any options and some actions may require multiple options.",
		"string": "Text to modify"
	},
	examples: [
		"string encode base64 hello!",
		"string decode base64 aGVsbG8h",
		"string hash md5 hello!",
		"string encrypt hello!",
		"string decrypt <todo>",
		"string reverse hello!",
		"string emojify hello!"
	]
};