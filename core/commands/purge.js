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

	let num;
	if (args.length !== 1) {
		num = 10;				//	Default to 10 messages
	} else {
		num = parseInt(args[0]);
	}

	if (num > 100) num = 100;	//	We can only purge 100 messages at most

	message.delete().then(() => {
		message.channel.bulkDelete(num).catch(e => {
			console.trace(e);
		});
	});

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"prune"
	],
	permLevel: 10
};

exports.help = {
	name: "purge",
	category: "Moderation",
	description: "Purges a number of messages in the current channel",
	usage: "nsfw [number?]",
	params: {
		"number": "Number of messages to purge from the current channel. Defaults to 10"
	},
	examples: [
		"purge 15"
	]
};