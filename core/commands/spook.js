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
	if (args.length !== 1) return;
	const target = args[0];
	//const customMessage = args[1];
	const sender = message.author.tag;

	let userTarget;

	if(target.match(/<@!?\d{17,19}>/g)) {
		userTarget = message.mentions.users.first();
	} else {
		try {
			userTarget = client.users.find('id', target);
		} catch (e) {
			message.author.send("User does not appear to exist.");
		}
	}

	let spookyPics = [
		"https://i.imgur.com/4KD67We.jpg",
		"https://i.imgur.com/nLmJiir.jpg",
		"https://i.imgur.com/yVxx7Hv.jpg",
		"https://i.imgur.com/3BDgmRe.jpg",
		"https://i.imgur.com/PRvZEn7.jpg",
		"https://i.imgur.com/cRgjwb2.jpg",
		"https://i.imgur.com/MWiDknU.jpg"
	];

	let currentIndex = spookyPics.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = spookyPics[currentIndex];
		spookyPics[currentIndex] = spookyPics[randomIndex];
		spookyPics[randomIndex] = temporaryValue;
	}

	userTarget.send(`${spookyPics[0]}\n\n***OoOOooh!***\n_You have been spooked by ${sender}!_\nHappy Halloween!`).then(msg => {
		message.delete();
	}).catch(err => {
		message.author.send(`The target does not appear to allow me to send them DMs. I cannot spook them if I cannot send them DMs.`);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	cooldown: 60,
	permLevel: 5
};

exports.help = {
	name: "spook",
	category: "Fun",
	description: "Happy Halloween",
	usage: "spook [target] [message?]",
	params: {
		"target": "User ID or mention of target you want to spook",
		"message": "(Optional) Message to include along with the spooky message"
	},
	examples: [
		"spook @Username#0000",
		"spook 290188585296986113 get spooked ya loser"
	]
};