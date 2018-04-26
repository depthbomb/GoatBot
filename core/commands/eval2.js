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
	if(args.length < 0) return;
	const code = args.join(" ");

	try {
		const start = process.hrtime();
		let execTime = process.hrtime(start);
		let evaled = eval(code);
		const clean = await client.clean(client, evaled);

		if (typeof evaled !== "string") {
			evaled = require("util").inspect(evaled);
		}

	} catch (err) {
		message.reply(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 2,
	aliases: [
		"ev2"
	],
	permLevel: 10
};

exports.help = {
	name: "eval2",
	category: "System",
	description: "Evaluates arbitrary JavaScript code, but without output.",
	usage: "eval2 [code]",
	params: {
		"code": "JavaScript code to evaluate"
	},
	examples: [
		"eval2 ['test', 'test2'].join(', ')"
	]
};