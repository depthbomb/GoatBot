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
	if (!args || args.length === 0) return;
	if (!message.channel.nsfw && message.channel.type !== "dm") return client.msg(message, "red", "error", "This command can only be used in NSFW channels.");

	const shuffle = require('shuffle-array');
	const request = require('request');
	const { RichEmbed } = require('discord.js');

	const ratings = ["e", "q", "s", "a"];
	let blacklistedTags = ["vore", "inflation", "gore", "macro", "scat", "watersports", "suicide", "fag", "abuse", "imminent_death", "loli", "shota", "diaper", "urine", "vomit",  "torture", "necrophilia", "castration", "hyper", "death_by_penis", "obese", "morbidly_obese", "epilepsy_warning", "feces", "flatulence", "fart", "smegma", "nightmare_fuel", "noose", "incest", "mutilation", "cheese_grater", "sensory_deprivation", "permanent_bondage", "flash", "family_guy", "death", "what", "advertisement", "what_has_science_done", "where_is_your_god_now", "male_birth", "male_pregnancy", "puffy_anus", "type:swf", "type:webm", "order:score_asc", "swastika", "nazi"];
	let nsfwBlacklist = ['cub', 'young', 'pregnant', 'nezumi'];	//	Tags that will be disallowed when using Q, E, and A ratings

	let rating = args[0];
	let pageNum = args[1];
	let tags = args.slice(2).join(" ").toLowerCase();

	let bl = blacklistedTags.map(w => {
		return +new RegExp('\\b' + w + '\\b', 'gi').test(tags);
	});

	if (bl.indexOf(1) >= 0) return client.msg(message, "red", "error", "Your tags contain blacklisted terms.");

	if (rating == null) return client.msg(message, "red", "error", "Rating argument is required");
	if (client.isNaN(pageNum)) return client.msg(message, "red", "error", "Page must be a number");
	if (pageNum > 750 || pageNum < 1) return client.msg(message, "red", "error", "Page number must be greater than 0 and less than 750");
	if (tags == null) return client.msg(message, "red", "error", "Tags are required");
	if (tags.split(" ").length > 5) return client.msg(message, "red", "error", "You may only search 5 tags at a time.");

	if (ratings.includes(rating) && rating.length == 1) {
		if (rating === 'e' || rating === 'q' || rating === 'a') {
			let nbl = nsfwBlacklist.map(w => {
				return +new RegExp('\\b' + w + '\\b', 'gi').test(tags);
			});

			if (nbl.indexOf(1) >= 0) return client.msg(message, "red", "error", "Your query contains tags that may not be used with *Q*, *E*, or *A* ratings.");
		}

		let maxAttempts = 5;
		let attempts = 0;
		let msg = await message.channel.send("Waiting...");
		tags = tags.replace(/rating:.*/g, "");	//	Remove any rating tags the user adds

		const searchQuery = `tags=${tags}+rating:${rating}&limit=320&page=${pageNum}`;
		const apiUrl = `https://e621.net/post/index.json?${searchQuery}`;

		msg.edit("Connecting to API...");
		request({
			headers: {
				"User-Agent": client.config.userAgent
			},
			uri: apiUrl,
			method: 'GET'
		}, (err, res, body) => {
			if (err) return msg.edit("There was a problem when requesting API data. Please try again.");

			let data = JSON.parse(body);

			msg.edit("API data retrieved, processing...");

			let sendPost = (d) => {
				if (d.success && d.success === false) return msg.edit(`<@${message.author.id}>, Error: ` + d.message);
				if (d === undefined || d.length == 0) return msg.edit(`<@${message.author.id}>, No results for your query. Make sure the tags you used exist and are formatted correctly. If the tags are correct then try lowering the page number. If all else fails, then there might just not be any results for what you searched for.\n¯\\_(ツ)_/¯`);

				let selected = shuffle(data)[0];
				let postTags = selected.tags.split(" ");
				let blT = blacklistedTags.map((w) => {
					return +new RegExp('\\b' + w + '\\b', 'gi').test(postTags);
				});

				if (attempts !== maxAttempts) {
					if (blT.indexOf(1) >= 0) {
						attempts++;
						msg.edit(`Blacklisted post found... trying again... (${attempts} out of ${maxAttempts})`);
						setTimeout(() => {
							sendPost(data);
						}, 1000);
						return;
					} else {
						let tags = `\`${client.trunc(selected.tags, 1000, {ellipsis: "..."})}\``;
						let desc = `${client.trunc(selected.description, 1000, {ellipsis: "..."})}`;
						let postEmbed = new RichEmbed()
							.setAuthor('E621', 'https://e621.net/apple-touch-icon.png', 'https://e621.net/')
							.setImage(selected.file_url)
							.setDescription(`https://e621.net/post/show/${selected.id}/`)
							.addField("Description", `${selected.description !== "" ? desc : "_No description_"}`)
							.addField("Tags", tags)
							.addField("Artist(s)", selected.artist.length > 0 ? "`" + selected.artist.join(", ") + "`" : "unknown_artist")
							.setFooter(`${data.length < 320 ? data.length : '>' + data.length} results`)
							.setColor("#002d55");

						msg.edit(`<@${message.author.id}>`, {
							embed: postEmbed
						});
					}
				} else {
					msg.edit(`Attempt limit reached. Please try again.`);
				}
			};

			sendPost(data);
		});
	} else {
		return client.msg(message, "red", "error", `Invalid rating provided. Valid ratings are **${ratings.join(', ')}**.`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 7.5,
	aliases: [
		"e6",
		"salt",
		"yiff"
	],
	permLevel: 0
};

exports.help = {
	name: 'e621',
	category: 'Search',
	description: 'Command for getting data from e621.net.',
	usage: 'e621 [rating] [page] [tags]',
	params: {
		"rating": "Rating to look for. Can be 's', 'q', 'e', or 'a'.",
		"page": "Page number to search in. Max of 750. You are likely to find no results in very high page numbers so stick to around 1 to 10.",
		"tags": "Tags used when finding posts. Max of 5 tags."
	},
	examples: [
		"e621 s 2 fluffy",
		"yiff e 3 butt",
		"e6 a 3 goat cute"
	]
};