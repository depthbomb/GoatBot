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
	const settings = client.config;
	if (!args[0]) {
		const myCommands = message.guild ? client.commands.filter(cmd => cmd.conf.permLevel <= level) : client.commands.filter(cmd => cmd.conf.permLevel <= level &&  cmd.conf.guildOnly !== true);
		const commandNames = myCommands.keyArray();
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		let currentCategory = "";
		let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details. For bot details, type !about]\n`;
		const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
		sorted.forEach( c => {
			const cat = c.help.category.toProperCase();
			if (currentCategory !== cat) {
				output += `\n== ${cat} ==\n`;
				currentCategory = cat;
			}
			output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
		});
		message.author.send(output, {code:"asciidoc", split: true}).then((msg) => {
			message.react("📨");
		}).catch(err => {
			message.reply("I cannot send the commands to you. You _must_ allow DMs from me for some commands to function.");
		});
	} else {
		let hasParams;
		let paramLine = '';
		let command;
		let parameters = [];
		if (client.commands.has(args[0])) {
			command = args[0];
		} else if (client.aliases.has(args[0])) {
			command = client.aliases.get(args[0]);
		}
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			if (level < command.conf.permLevel) return;

			let examples = [];
			command.help.examples.forEach((element) => {
				examples.push(`* ${settings.prefix}${element}`)
			});

			if(command.help.hasOwnProperty("params")) {
				hasParams = true;
				let parameterNum = 1;
				Object.keys(command.help.params).forEach((key) => {
					parameters.push(`${parameterNum}. [${key}] - ${command.help.params[key]}`);
					parameterNum++;
				});
			} else {
				hasParams = false;
			}

			if (hasParams) paramLine = `Parameters\n----------\n${parameters.join("\n")}\n\n`;

			message.author.send(
				`# ${command.help.name.toProperCase()}\n` +
				`${command.help.description}\n\n` +
				`Cooldown\n--------\n${command.conf.hasOwnProperty('cooldown') ? command.conf.cooldown : client.config.cooldowns.default} seconds\n\n` +
				`Guild Only\n----------\n${command.conf.guildOnly.toString()}\n\n` +
				`Aliases\n-------\n${command.conf.aliases.length > 0 ? command.conf.aliases.join(", ") : 'None'}\n\n` +
				`Usage\n-----\n${settings.prefix}${command.help.usage}\n\n` +
				paramLine +
				`Examples\n--------\n${examples.join("\n")}`

				, {code: "markdown", split: true}
			).then((msg) => {
				message.react("📨");
			}).catch(err => {
				message.reply("I cannot send the commands to you. You _must_ allow DMs from me for some commands to function.");
			});
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [
		"h",
		"halp",
		"cmds",
		"commands"
	],
	permLevel: 0
};

exports.help = {
	name: "help",
	category: "System",
	description: "Displays all the available commands for your permission level.",
	usage: "help [command?]",
	params: {
		"command": "(Optional) command to view details on"
	},
	examples: [
		"help",
		"help dice"
	]
};