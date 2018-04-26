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
module.exports = (client, oldGuild, newGuild) => {
	const Table = require('cli-table2');
	const table = new Table({head: ['', 'Old', 'New'], style: {head:[]}});

	table.push(
		{"Name": [oldGuild.name, newGuild.name]},
		{"Acronym": [oldGuild.nameAcronym, newGuild.nameAcronym]},
		{"Icon": [oldGuild.iconURL, newGuild.iconURL]},
		{"Region": [oldGuild.region, newGuild.region]},
		{"AFK Timeout": [oldGuild.afkTimeout, newGuild.afkTimeout]},
		{"Security Level": [oldGuild.verificationLevel, newGuild.verificationLevel]}
	);

	client.log("event", `Guild [${oldGuild.name}] was updated:`);
	console.log(table.toString());
};