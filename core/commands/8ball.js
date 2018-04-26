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
exports.run = async (client, message, args, level) => {
	const { RichEmbed } = require('discord.js');
	let question = args.join(" ");
	if(question.endsWith("?")) {
		const shuffle = require('shuffle-array');
		const responses = [
			// Affirmative
			"It is certain",
			"It is decidedly so",
			"Without a doubt",
			"Yes, definitely",
			"You may rely on it",
			"As I see it, yes",
			"Most likely",
			"Outlook good",
			"Yes",
			"Signs point to yes",
			// Non-committal
			"Reply hazy, try again",
			"Ask again later",
			"Better not tell you now",
			"Cannot predict now",
			"Concentrate and ask again",
			// Negative
			"Don't count on it",
			"My reply is no",
			"My sources say no",
			"Outlook not so good",
			"Very doubtful"
		];
		const embed = new RichEmbed()
					.setColor('#232323')
					.setDescription(`\:8ball: <@${message.author.id}>, ${shuffle(responses)[0]}`);

		message.channel.send({ embed });
	} else {
		client.msg(message, 'orange', 'warning', 'Question must end with a question mark.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		'8b'
	],
	permLevel: 0
};

exports.help = {
	name: "8ball",
	category: "Fun",
	description: "Ask the Magic 8-Ball (almost) anything!",
	usage: "8ball [question]",
	params: {
		"question": "Question to ask, must end with ?"
	},
	examples: [
		"8ball Will I ever get married?"
	]
};