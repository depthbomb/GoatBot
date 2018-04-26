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
	if (!args) return message.reply("Please supply a message ID");

	let messageID = args[0];

	message.channel.fetchMessage(messageID).then(msg => {
		msg.delete().then(() => {
			message.delete();
		});
	}).catch(console.error)
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		"del",
		"delet"
	],
	permLevel: 3
};

exports.help = {
	name: "delete",
	category: "Moderation",
	description: "Deletes a message by ID",
	usage: "delete [message ID]",
	params: {
		"message ID": "ID of the message you want to delete"
	},
	examples: [
		"delete 357686677051985921"
	]
};