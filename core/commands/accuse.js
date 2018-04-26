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

	let msg = await message.author.send("One moment please...");

	let direction = args[0];
	let text = args.slice(1).join(" ");
	let baseImage;
	let yCoord;
	let maxLetters = 150;

	if (text.length > 150 || text.length < 5) return msg.edit("Message must be between 5 and 150 characters long.");

	if (direction === "up") {
		yCoord = 72;
		baseImage = `${client.appPath}/resources/img/koza_accuse_up.png`;
	} else {
		yCoord = 10;
		baseImage = `${client.appPath}/resources/img/koza_accuse_down.png`;
	}

	if (message.channel.type !== "dm") {
		message.delete();
	}

	const fs = require('fs');
	const jimp = require('jimp');
	const imgur = require('imgur');
	const imageName = `${client.tmpPath}/${client.cuid()}.png`;

	jimp.read(baseImage, (err, img) => {
		if (err) return msg.edit(err);

		jimp.loadFont(`${client.appPath}/resources/fonts/impact.fnt`).then ((font) => {
			img.print(font, 10, yCoord, text, 380);

			img.write(imageName, () => {
				imgur.setCredentials(client.config.imgur.username, client.config.imgur.password, client.config.imgur.client);
				imgur.uploadFile(imageName, 'yalU7').then((json) => {
					msg.edit(`<@${message.author.id}>, here is your image, save it or copy the URL somewhere for use later! ${json.data.link}`);
					fs.unlinkSync(imageName);
				});
			});
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"acc"
	],
	cooldown: 10,
	permLevel: 0
};

exports.help = {
	name: "accuse",
	category: "Fun",
	description: "Generates an 'accusation' image",
	usage: "accuse [direction] [text]",
	params: {
		"direction": "Direction in which to point",
		"text": "Text in the image"
	},
	examples: [
		"accuse up This user is a Skeleton, avoid them at all cost"
	]
};