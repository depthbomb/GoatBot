/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2018 Caprine Softworks - https://caprine.net
|
|	This library is free software; you can redistribute it and/or
|	modify it under the terms of the GNU Lesser General Public
|	License as published by the Free Software Foundation; either
|	version 2.1 of the License, or (at your option) any later version.
|
|	This library is distributed in the hope that it will be useful,
|	but WITHOUT ANY WARRANTY; without even the implied warranty of
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

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