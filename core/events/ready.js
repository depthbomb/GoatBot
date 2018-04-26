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
module.exports = async client => {
    const chalk = require('chalk');
    // Why await here? Because the ready event isn't actually ready, sometimes
    // guild information will come in *after* ready. 1s is plenty, generally,
    // for all of them to be loaded.
    await client.wait(1000);

    client.disableEveryone = true;
    client.disabledEvents = [
        'TYPING_START',
        'VOICE_STATE_UPDATE',
        'VOICE_SERVER_UPDATE',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'CHANNEL_PINS_UPDATE',
        'USER_NOTE_UPDATE',
        'RELATIONSHIP_ADD',
        'RELATIONSHIP_REMOVE'
    ];

    if(client.user.username !== client.config.botUsername) {
        client.user.setUsername(client.config.botUsername);
    }

    client.user.setPresence({
        status: "online",
        afk: false,
        game: {
            name: client.config.initialGame,
            type: 0
        }
    });

    process.stdout.write('\033c');	//	Clear console

    let ascii = ["┌─────────────────────────────────────────────────────────────────────────┐",
                 "│                                                                         │",
                 "│                                                                         │",
                 "│               ______                  ____        __  __                │",
                 "│              / ____/_  ______ _____  / __ )____  / /_/ /                │",
                 "│             / /   / / / / __ `/ __ \\/ __  / __ \\/ __/ /                 │",
                 "│            / /___/ /_/ / /_/ / / / / /_/ / /_/ / /_/_/                  │",
                 "│            \\____/\\__, /\\__,_/_/ /_/_____/\\____/\\__(_)                   │",
                 "│                 /____/                                                  │",
                 "│                                                                         │",
                 "│                                                                         │",
                 "├─────────────────────────────────────────────────────────────────────────┤",
                 "│            « Made by depthbomb#7698, powered by goat butts »            │",
                 "└─────────────────────────────────────────────────────────────────────────┘"];

    //	 Write our pretty logo
    console.log(chalk.bgCyan.whiteBright(ascii.join("\n")));
    console.log(chalk.bgCyan.whiteBright(`Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`))
};