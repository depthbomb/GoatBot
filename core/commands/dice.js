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
	if (!args || args.length < 2) return message.reply("Both arguments are required.");

	const randnum = require('random-number-between');
	const pluralize = require('pluralize');

	const numDice = args[0];
	const maxNum = args[1];

	if(maxNum < 2 || maxNum > 1001) {
		message.channel.send('Number of dice sides must be greater than 1 and less than or equal to 1000');
		return;
	}
	if(numDice > 100) {
		message.channel.send('Number of dice rolled must be 100 or smaller');
		return;
	}

	let results = randnum(1, maxNum, numDice);

	message.reply(`:game_die: Rolled ${numDice} ${maxNum}-sided ${pluralize('die', numDice)} and got ***${results.join(', ')}*** :game_die:`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [
		'roll'
	],
	permLevel: 0
};

exports.help = {
	name: "dice",
	category: "Fun",
	description: "Roll a dice.",
	usage: "dice [die count] [side count]",
	params: {
		"die count": "Number of die to roll",
		"side count": "Number of sides per die"
	},
	examples: [
		"dice 5 10"
	]
};