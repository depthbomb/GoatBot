/*************************************************************************
This file is part of GoatBot!

Copyright © 2017-2018 Caprine Softworks <https://caprine.net>

GoatBot! licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

You should have received a copy of the license along with this
work.  If not, see <http://creativecommons.org/licenses/by-nc-sa/3.0/>.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*************************************************************************/
module.exports = (client) => {
	const fs = require('fs');

	/*
	SINGLE-LINE AWAITMESSAGE
	A simple way to grab a single reply, from the user that initiated
	the command. Useful to get "precisions" on certain things...
	USAGE
	const response = await client.awaitReply(msg, "Favourite Color?");
	msg.reply(`Oh, I really love ${response} too!`);
	*/
	client.awaitReply = async (msg, question, limit = 60000) => {
		const filter = m=>m.author.id = msg.author.id;
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch (e) {
			return false;
		}
	};

	client.extractUser = (message, string) => {
		if(target.match(/<@!?\d{17,19}>/g)) {
			return message.mentions.users.first();
		} else {
			try {
				return client.users.find('id', string);
			} catch (e) {
				throw new Error("User does not appear to exist.");
			}
		}
	};

	client.error = (msg, err) => {
		const { RichEmbed } = require('discord.js');
		const crypto = require('crypto');
		const algorithm = 'aes-256-cbc';
		const key = "stackTraceSalt__CYAN";
		const cipher = crypto.createCipher(algorithm, key);
		let errorStack = `**UserID:** ${msg.author.id}\n**ChannelID:** ${msg.channel.id}\n**DM?:** ${msg.channel.type === "dm"}\n${msg.guild.available ? "**Guild:** " + msg.guild.name + "\n" : ""}\n\`\`\`JS\n${err}\n\`\`\``;
		let encrypted = cipher.update(errorStack, "utf8", "base64");
		encrypted += cipher.final('base64');

		let embed = new RichEmbed()
						.setAuthor("Something broke!", client.user.avatarURL)
						.setColor(clientColors.red)
						.setDescription("I have encountered a problem! If you see my creator, send them the code below.")
						.addField("\u200B", `\`\`\`\n${encrypted}\n\`\`\``, true)
						.setThumbnail(client.emojis.find("name", "caprineError").url)
		return msg.reply({ embed });
	};

	/**
	 * Sends a fancy-looking message
	 * @param {object} messageObj Message object, used for replying
	 * @param {string} type Embed color
	 * @param {string} icon Emoji
	 * @param {string} message Message
	 * @param {bool} reply Whether to ping the invoking user
	 * @param {bool} autoDelete Whether to auto-delete sent message
	 * @param {bool} autoDeleteDelay Delay in seconds when deleting the message
	 */
	client.msg = (messageObj, type, icon, message, reply = true, autoDelete = true, autoDeleteDelay = 10) => {
		const { RichEmbed } = require('discord.js');
		const colors = {
			"black": "#212121",
			"yellow": "#faa61a",
			"default": "#99aab5",
			"red": "#f04747",
			"orange": "#f57731",
			"green": "#43b581",
			"blue": "#3498db"
		};
		const emojis = {
			"gold": client.emojis.find("name", "caprineGold"),
			"ungag": client.emojis.find("name", "caprineCommentNormal"),
			"gag": client.emojis.find("name", "caprineGag"),
			"mute": client.emojis.find("name", "caprineMute"),
			"search": client.emojis.find("name", "caprineSearch"),
			"refresh": client.emojis.find("name", "caprineRefresh"),
			"error": client.emojis.find("name", "caprineError"),
			"warning": client.emojis.find("name", "caprineWarning"),
			"success": client.emojis.find("name", "caprineSuccess"),
			"info": client.emojis.find("name", "caprineInfo"),
			"close": client.emojis.find("name", "caprineClose")
		};
		const color = colors[type];
		const emoji = emojis[icon];
		const embed = new RichEmbed()
					.setColor(color)
					.setDescription(`${emoji} ${reply ? "<@" + messageObj.author.id + ">, " : ""}${message}`);

		return messageObj.channel.send({ embed }).then(m => {
			if (autoDelete) {
				setTimeout(() => {
					m.delete();
				}, autoDeleteDelay * 1000);
			}
		});
	};


	client.cooldown = async (message, cooldownName, cooldownDuration, reply = true, callback) => {
		const now = require('moment')().unix() * 1000;
		const messageTime = message.createdTimestamp;
		let cooldownPath = `${client.tmpPath}/cooldowns/${cooldownName}.json`;
		let timeLeft;
		fs.stat(cooldownPath, (err, stat) => {
			if (err == null) {
				const ms = require('ms');
				return fs.readFile(cooldownPath, (err, data) => {
					if (err) throw err;
					let expiration = JSON.parse(data).ex;
					timeLeft = expiration - messageTime;
					if (reply) message.reply(`Please try again in about ${ms(timeLeft, {long: true})}.`).then(cdMsg => {
						setTimeout(() => {
							cdMsg.delete();
						}, 5000);
					});
				});
			} else if (err.code === 'ENOENT') {	//	Cache file does not exist
				fs.writeFile(cooldownPath, JSON.stringify({"ex":(messageTime + cooldownDuration)}), (err) => {
					if (err) throw err;
					setTimeout(() => {
						fs.unlink(cooldownPath, (err) => {
							if (err && err.code !== 'ENOENT') client.log("error", "Error removing cooldown: " + err);
						});
					}, cooldownDuration);
				});
			}

			callback();
		});
	};

	/*
	MESSAGE CLEAN FUNCTION
	"Clean" removes @everyone pings, as well as tokens, and makes code blocks
	escaped so they're shown more easily. As a bonus it resolves promises
	and stringifies objects!
	This is mostly only used by the Eval and Exec commands.
	*/
	client.clean = async (client, text) => {
		if (text && text.constructor.name == "Promise")
		text = await text;
		if (typeof evaled !== "string")
		text = require("util").inspect(text, {depth: 0});

		text = text
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203))
		.replace(client.token, "{null}");

		return text;
	};

	client.fileExists = (path) => {
		fs.stat(path, (err, stat) => {
			if(err == null) {
				return true;
			} else if(err.code == 'ENOENT') {
				return false;
			} else {
				return false;
			}
		});
	};

	client.isNaN = (param) => {
		return isNaN(parseInt(param));
	};

	client.b64 = {
		encode (string) {
			return require('btoa')(string);
		},
		decode (string) {
			return require('atob')(string);
		},
		check (string) {
			return (client.b64.decode(client.b64.encode(string)) == string);
		}
	};

	String.prototype.toProperCase = function () {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	String.prototype.scramble = function () {
		let a = this.split(""),
		n = a.length;

		for (let i = n - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join("");
	};

	Array.prototype.shuffle = function () {
		let currentIndex = this.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this[currentIndex];
			this[currentIndex] = this[randomIndex];
			this[randomIndex] = temporaryValue;
		}

		return this;
	}

	// `await client.wait(1000);` to "pause" for 1 second.
	client.wait = require("util").promisify(setTimeout);

	// These 2 simply handle unhandled things. Like Magic. /shrug
	process.on("uncaughtException", (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		console.trace("Uncaught Exception: ", errorMsg);
	});

	process.on("unhandledRejection", err => {
		console.trace("Uncaught Promise Error: ", err);
	});
};