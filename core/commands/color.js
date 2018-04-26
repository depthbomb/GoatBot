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
	if (!args || args.length !== 1) return;

	const color = args[0];
	const fs = require('fs');
	const jimp = require('jimp');
	const imgur = require('imgur');
	const { RichEmbed } = require('discord.js');
	const imageName = `${client.tmpPath}/color_${client.cuid()}.png`;

	if (!color.match(/#?[a-fA-F0-9]{6}/i)) return client.msg(message, "red", "error", "The color code you provided is invalid.");

	let msg = await message.channel.send("Generating image, please wait...");

	const colorCode = color.replace(/^#/, '');

	let image = new jimp(1280, 720, parseInt("0x" + colorCode.toUpperCase() + "FF", 16), (err, img) => {
		if (err) throw new Error(err);

		img.write(imageName, () => {
			imgur.setCredentials(
				client.config.imgur.username,
				client.config.imgur.password,
				client.config.imgur.client
			);
			msg.edit("Almost done...");
			imgur.uploadFile(imageName, 'yalU7').then((json) => {
				let imageURL = json.data.link;
				let colorEmbed = new RichEmbed()
								.setDescription(`Color preview for \`#${colorCode} (0x${colorCode.toUpperCase()}FF)\``)
								.setColor(`#${colorCode}`)
								.setImage(imageURL);
				msg.edit(`<@${message.author.id}>`, {embed: colorEmbed}).then(() => {
					fs.unlinkSync(imageName);
				});
			});
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: "color",
	category: "Info",
	description: "Input a color code and see a preview",
	usage: "color [code]",
	params: {
		"code": "Full hexadecimal color code, # is optional"
	},
	examples: [
		"color #ff69b4",
		"color ff00ff"
	]
};