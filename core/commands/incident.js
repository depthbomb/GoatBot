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
	if (args.length > 0) return;

	const cheerio = require('cheerio');
	const snekfetch = require('snekfetch');
	const Entities = require('html-entities').AllHtmlEntities;
	const entities = new Entities();
	const { RichEmbed } = require('discord.js');
	const statusUrl = "https://status.discordapp.com/";

	let statusMessage = await message.channel.send('Checking status...');

	return snekfetch.get(statusUrl).then(result => {
		let $ = cheerio.load(result.text);
		let statusBlock = $('.page-status').length ? $('.page-status') : $('.unresolved-incidents .unresolved-incident');
		let statusTitle = $('.page-status').length ? statusBlock.find('span.status').text().trim() : $('.unresolved-incidents').find('.incident-title>a').text().replace("Subscribe", "").trim();
		let statusColor;
		let hasUpdates = false;
		let updates = [];

		if (statusBlock.find('.updates').length) {
			hasUpdates = true;
			statusBlock.find('.updates>.update').each((i, v) => {
				/*help me*/
				updates.push(entities.decode($(v).html().replace(/<\/?strong>/ig, "**").replace(/<small>(.*)<\/?small>/ig, "_$1_").replace("<br>", "\n").replace(/[ ]{2,}/g, " ").replace(/\n\n/ig, "")).trim());
			});
		}

		if (statusBlock.hasClass('status-none')) statusColor = clientColors.green;
		else if (statusBlock.hasClass('status-minor')) statusColor = clientColors.orange;
		else if (statusBlock.hasClass('impact-major')) statusColor = clientColors.red;
		else if (statusBlock.hasClass('impact-none')) statusColor = clientColors.black;

		let statusEmbed = new RichEmbed()
							.setAuthor("Discord Status")
							.setColor(statusColor)
							.setDescription(`***${statusTitle}*** ${hasUpdates ? "\n\n" + updates.join("\n\n") : ""}`);

		statusMessage.edit(`<@${message.author.id}>`, {embed: statusEmbed});
	}).catch((err) => {
		statusMessage.edit('Could not fetch status: ' + err);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"incidents",
		"issue",
		"issues"
	],
	cooldown: 10,
	permLevel: 0
};

exports.help = {
	name: "incident",
	category: "Info",
	description: "Looks for a current incident/issue from the Discord status page",
	usage: "incident",
	params: {},
	examples: [
		"incident"
	]
};