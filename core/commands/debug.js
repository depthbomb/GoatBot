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
	const action = args[0];
	const option = args[1];

	if (action === "error") {
		return client.error(message, "This is a test error.\n" + Math.random()*Math.random()*9999285302)
	} else if (action === "trace") {
		const crypto = require('crypto');
		const algorithm = 'aes-256-cbc';

		let decipher = crypto.createDecipher(algorithm, "stackTraceSalt");
		let decrypted = decipher.update(option, "base64", "utf8");
		decrypted += decipher.final('utf8');

		message.reply("\n\n" + decrypted);
	} else if (action === "logTypes") {
		const logTypes = client.config.logTypes;

		logTypes.forEach(type => {
			client.log(type, `This is a test log entry for [${type}]`, false);
		});
	}
};

	exports.conf = {
		enabled: true,
		guildOnly: false,
		aliases: [
			"dbg"
		],
		cooldown: 1,
		permLevel: 10
	};

	exports.help = {
		name: "debug",
		category: "System",
		description: "General purpose debug command, creator-only",
		usage: "debug"
	};