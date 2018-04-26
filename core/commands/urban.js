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
	if (!args) return;
	const request = require('request');
	const { RichEmbed } = require('discord.js');
	const term = encodeURIComponent(args.join(" "));
	const apiUrl = `http://api.urbandictionary.com/v0/define?term=${term}`;

	let msg = await message.channel.send("Searching...");

	request({
		headers: {
			"User-Agent": client.config.defaultSettings.userAgent
		},
		uri: apiUrl,
		method: 'GET'
	}, (err, res, body) => {
		let data = JSON.parse(body);

		if (data.result_type === "no_results") {
			msg.edit(`<@${message.author.id}>, I didn't find any results using your search term :(`);
		} else {
			let result = data.list[0];
			let embed = new RichEmbed()
				.setTitle(`Results for \`${decodeURIComponent(term)}\``)
				.setDescription(result.permalink)
				.addField("Definition", client.trunc(result.definition, 1023))
				.addBlankField(true)
				.addField("Example(s)", client.trunc(result.example, 1023))
				.setColor("#134FE6");
			msg.edit(`<@${message.author.id}>`, {embed: embed});
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"ud",
		"urbandictionary"
	],
	cooldown: 5.5,
	permLevel: 0
};

exports.help = {
	name: "urban",
	category: "Info",
	description: "Find a definition on Urban Dictionary",
	usage: "urban [term]",
	params: {
		"term": "Term to search for"
	},
	examples: [
		"urban thought itch"
	]
};