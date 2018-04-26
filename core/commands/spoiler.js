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
exports.run = (client, message, args, level) => {
	if (!args) return;

	const crypto = require('crypto');
	const algorithm = 'aes-256-cbc';
	const key = "cyanbot_spoiler_command_key1";

	let topic = args[0];
	let spoiler = args.slice(1).join(" ");

	let cipher = crypto.createCipher(algorithm, key);
	let encrypted = cipher.update(spoiler, "utf8", "base64");
	encrypted += cipher.final('base64');

	let messageContent = `<@${message.author.id}> sent a spoiler for: \`${topic.replace(/-/g, ' ')}\` - _react with :eyes: to decode_\n\n\`${encrypted}\``;

	message.delete();

	message.channel.send(messageContent).then((msg) => {
		msg.react('👀');

		const collector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '👀' && user.id != client.user.id,
			{ time: 3600000 }
		);

		let sentUsers = [];
		let verb = sentUsers.length <= 1 ? "has" : "have";

		collector.on('collect', (r) => {
			let reactionUser = r.users.last();	//	To get the latest user that reacted
			let reactionUserMention = `<@${reactionUser.id}>`;
			if (!sentUsers.includes(reactionUserMention)) {
				sentUsers.push(reactionUserMention);
				reactionUser.send(`Spoiler for \`${topic.replace(/-/g, ' ')}\`:\n\n\`${spoiler}\``).then(() => {
					if (sentUsers.length > 0) {
						msg.edit(messageContent.concat(`\n\n${sentUsers.join(", ")} ${verb} read this spoiler.`));
					}
				});
			}
		});
		collector.on('end', collected => {
			msg.edit(messageContent.concat(`\n\n${sentUsers.join(", ")} ${verb} read this spoiler.\n\n***This spoiler has expired.***`));
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"spoil"
	],
	permLevel: 0
};

exports.help = {
	name: 'spoiler',
	category: 'Info',
	description: 'TODO',
	usage: "spoiler [topic] [message]",
	params: {
		"topic": "Topic of your spoiler, used to let others know what the spoiler pertains to. Use dashes instead of spaces",
		"message": "The spoiler message itself"
	},
	examples: [
		"spoiler My-Topic Everybody dies!"
	]
};