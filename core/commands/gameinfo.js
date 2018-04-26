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
	if (args.length > 1) return;

	const ssq = require('ssq');
	const { RichEmbed } = require('discord.js');
	const AsciiTable = require('ascii-table');
	const ms = require('ms');

	const action = args[0];

	const serverIp = '66.150.188.17';
	const serverPort = 27015;

	if (action === 'players') {
		let statusMessage = await message.channel.send('Checking players...');

		ssq.players(serverIp, serverPort, (err, data) => {
			if (err) throw new Error(err);
			if (data.length < 1) return statusMessage.edit(`<@${message.author.id}>, There are currently no players on the server.`);

			const players = data.sort(sortByKey('score', 'desc'));

			const table = new AsciiTable(`${players.length}/32 players `);
			table.setHeading('Name', 'Score', 'Time')

			players.forEach(user => {
				table.addRow(user.name !== '' ? user.name : '<unconnected>', user.score, `${ms(Math.floor(user.duration * 1000), {long: true})}`);
			});
	
			return statusMessage.edit(`<@${message.author.id}>\n\`\`\`${table.toString()}\`\`\``);
		});
	} else {
		let statusMessage = await message.channel.send('Checking server...');

		ssq.info(serverIp, serverPort, (err, data) => {
			if (err) throw new Error(err);
	
			const serverInfoEmbed = new RichEmbed()
				.setAuthor('Cyan.TF Server Info', 'https://cyan.tf/serverapi/bot/cyan-logo.png', 'https://cyan.tf/')
				.setColor('#0097a7')
				.setFooter(`${serverIp}:${serverPort}`)
				.setTimestamp()
				.addBlankField()
				.addField('Map', data.map, true)
				.addField('Players', `${data.numplayers}/${data.maxplayers}`, true);
	
			return statusMessage.edit(`<@${message.author.id}>`, {
				embed: serverInfoEmbed
			});
		});
	}


	const sortByKey = (key, order = 'asc') => {
		return function (a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				return 0;
			}

			const varA = (typeof a[key] === 'string') ?
				a[key].toUpperCase() : a[key];
			const varB = (typeof b[key] === 'string') ?
				b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return (
				(order == 'desc') ? (comparison * -1) : comparison
			);
		};
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 15,
	globalCd: true,
	aliases: [
		"gi"
	],
	permLevel: 0
};

exports.help = {
	name: "gameinfo",
	category: "Info",
	description: "Returns info on the Cyan.TF server",
	usage: "gameinfo [\"players\"?]",
	params: {
		'"players"': '(Optional) Gets info on current players in the server. Anything else will get info on the server itself.'
	},
	examples: [
		"gameinfo",
		"gi players",
	]
};