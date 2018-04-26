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
	const shuffle = require("shuffle-array");
	const validMoves = ["rock", "paper", "scissors"];
	const botMoves = ["rock", "paper", "scissors"];
	const move = args[0].toLowerCase();
	const user = `<@${message.author.id}>`;
	const bot = `<@${client.user.id}>`;
	
	const goatChance = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
	const goatRoll = 7;

	if (goatChance === goatRoll) botMoves.push('goat');
	if (message.author.id === client.config.ownerId) validMoves.push('goat');

	const emoji = {
		rock: "✊",
		paper: "✋",
		scissors: "✌️",
		goat: "🐐"
	};

	if (validMoves.includes(move)) {
		let botMove = shuffle(botMoves)[0];
		let outcomeMessage;
		let vsMessage = `${user} ${emoji[move]} _vs._ ${emoji[botMove]} ${bot}`;

		if ((move === "rock" && botMove === "rock") ||
			(move === "paper" && botMove === "paper") ||
			(move === "scissors" && botMove === "scissors")) outcomeMessage = `It's a tie, we are both losers!`;

		if ((move === "rock" && botMove === "scissors") ||
			(move === "paper" && botMove === "rock") ||
			(move === "scissors" && botMove === "paper")) outcomeMessage = `${user}'s ${move} beats ${bot}'s ${botMove}!`;

		if ((botMove === "rock" && move === "scissors") ||
			(botMove === "paper" && move === "rock") ||
			(botMove === "scissors" && move === "paper")) outcomeMessage = `${bot}'s ${botMove} beats ${user}'s ${move}!`;

		if (move === "goat") outcomeMessage = `${user}'s ${move} beats ${bot}'s ${botMove}!`;
		if (botMove === "goat") outcomeMessage = `${bot}'s ${botMove} beats ${user}'s ${move}!`;

		return message.channel.send(`${vsMessage}\n\n${outcomeMessage}`);
	} else {
		return;
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	cooldown: 5,
	aliases: [
		'rockpaperscissors'
	],
	permLevel: 0
};

exports.help = {
	name: "rps",
	category: "Fun",
	description: "Play Rock, Paper, Scissors against a bot.",
	usage: "rps [move]",
	params: {
		"move": "Your move, either Rock, Paper, or Scissors"
	},
	examples: [
		"rps paper"
	]
};