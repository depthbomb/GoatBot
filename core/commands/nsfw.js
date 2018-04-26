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
	
	const nsfwRole = message.member.guild.roles.find('name', 'NSFW').id;

	if (message.member.roles.exists('name', 'NSFW')) {
		message.member.removeRole(nsfwRole, 'Via CyanBot!').then(() => {
			message.delete().then(msg => {
				msg.reply('Your access to the NSFW channels has been revoked.');
			});
		});
	} else {
		message.member.addRole(nsfwRole, 'Via CyanBot!').then(() => {
			message.delete().then(msg => {
				msg.reply('You have been given access to the NSFW channels. Have fun ( ͡° ͜ʖ ͡°)');
			});
		});
	}

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"r18"
	],
	permLevel: 0
};

exports.help = {
	name: "nsfw",
	category: "Server",
	description: "Gives or revokes access to the NSFW channels",
	usage: "nsfw",
	params: {},
	examples: [
		"nsfw"
	]
};