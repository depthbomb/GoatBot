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
module.exports = (client, oldMember, newMember) => {
	const Table = require('cli-table2');
	const table = new Table({head: ['', 'Old', 'New'], style: {head:[]}});

	let oldRolesArray = [];
	let newRolesArray = [];

	oldMember.roles.forEach(role => {
		oldRolesArray.push(role.name);
	});
	newMember.roles.forEach(role => {
		newRolesArray.push(role.name);
	});

	table.push(
		{"Name": [oldMember.displayName, newMember.displayName]},
		{"Roles": [oldRolesArray.join(", "), newRolesArray.join(", ")]},
		{"Color": [oldMember.displayHexColor, newMember.displayHexColor]}
	);

	client.log("event", `${oldMember.displayName} was updated in ${oldMember.guild.name}:`);
	console.log(table.toString());
};