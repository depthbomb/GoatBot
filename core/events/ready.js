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
            name: client.localMode ? '<DEV MODE>' : client.config.initialGame,
            type: 0
        }
    });

    process.stdout.write('\033c');	//	Clear console

    let ascii = ["┌─────────────────────────────────────────────────────────────────────────┐",
                 "│                                                                         │",
                 "│                                                                         │",
                 "│                 ______            __  ____        __  __                │",
                 "│                / ____/___  ____ _/ /_/ __ )____  / /_/ /                │",
                 "│               / / __/ __ \\/ __ `/ __/ __  / __ \\/ __/ /                 │",
                 "│              / /_/ / /_/ / /_/ / /_/ /_/ / /_/ / /_/_/                  │",
                 "│              \\____/\\____/\\__,_/\\__/_____/\\____/\\__(_)                   │",
                 "│                                                                         │",
                 "│                                                                         │",
                 "│                                                                         │",
                 "├─────────────────────────────────────────────────────────────────────────┤",
                 "│            « Made by depthbomb#7698, powered by goat butts »            │",
                 "└─────────────────────────────────────────────────────────────────────────┘"];

    //	 Write our pretty logo
    console.log(chalk.bgCyan.whiteBright(ascii.join("\n")));
    console.log(chalk.bgCyan.whiteBright(`Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`));
};