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
	const status = args[0];

	let statusMessage;
	if (typeof status !== 'undefined') {
		//	Set custom status
		statusMessage = status;
	} else {
		//	Set default status
		statusMessage = client.config.game;
	}

	client.user.setPresence({
        status: "online",
        afk: false,
        game: {
            name: statusMessage,
            type: 0
        }
    }).then(() => {
		message.delete().then(m => {
			client.msg(m, 'green', 'success', `My status has been set to \`${statusMessage}\`.`);
		});
	});
};

	exports.conf = {
		enabled: true,
		guildOnly: false,
		aliases: [],
		cooldown: 5,
		permLevel: 10
	};

	exports.help = {
		name: "status",
		category: "System",
		description: "Sets my status",
		usage: "status Hello!"
	};