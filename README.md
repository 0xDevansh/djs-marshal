
# djs-marshal

![npm](https://img.shields.io/npm/v/djs-marshal?style=for-the-badge)
![downloads](https://img.shields.io/npm/dm/djs-marshal?style=for-the-badge)
![discord](https://img.shields.io/discord/873232757508157470?color=5865F2&label=discord&style=for-the-badge)

A lightweight command handler for discord.js interactions

> This package requires discord.js v13 or higher to be installed

## Installation

```bash
# with npm
npm install djs-marshal --save
# with yarn
yarn add djs-marshal

# this package also requires discord.js
npm install discord.js --save
```

## Quick Start

In your root file, preferably index.js/ts, initialize the bot like so

```js
import Marshal from 'djs-marshal'
import { Intents } from "discord.js";
import path from 'path';

// https://deathvenom54.github.io/djs-marshal/modules.html#initializeBot
const client = Marshal.initializeBot({
  intents: [Intents.FLAGS.GUILDS],
  // you can pass in the token to make the client login 
  // automatically 
  token: 'your-token-here',
  // this is the folder path that contains your commands
  slashCommandsPath: path.join(__dirname, 'commands'),
  // send all log messages
  logLevel: 'verbose',
  // logs messages in a detailed manner
  logStyle: 'expanded'
});
```

Now in your commands' folder, you can start creating command files!

Here are some examples:

```ts
// ping.js|ts
import { SlashCommand } from "djs-marshal";

// a pretty basic command. command is a discord.js
// CommandInteraction and you can use its methods like
// reply, defer, editReply, etc.
const ping: SlashCommand = {
  name: 'ping',
  description: 'Play ping-pong with me',
  commandType: 'global',
  execute (command) {
    command.reply('Pong!')
  }
};

export default ping;
// https://deathvenom54.github.io/djs-marshal/modules.html#SlashCommand
```

```ts
// guildPing.js|ts
import { SlashCommand } from "djs-marshal";

// any command with a guildId specified is registered as
// as a guild command and will only work in that guild
const guildPing: SlashCommand = {
  name: 'guildping',
  description: 'Play ping-pong with me in this server',
  commandType: 'guild',
  guildId: '873232757508157470',
  execute (command) {
    command.reply('Peng!');
  }
};

export default guildPing;
```

```ts
// deferredPing.js|ts
import { SlashCommand } from "djs-marshal";

// you can pass in defer as true to defer the interaction beforehand
const deferredPing: SlashCommand = {
  name: 'slothping',
  description: 'piiiiiinnnnnng',
  commandType: 'global',
  // you can also use deferEphemeral to mark the reply ephemeral
  defer: true,
  execute (command) {
    setInterval(() =>{
      command.editReply('Pooooooonnnngg!');
    }, 3000)
  }
};

export default deferredPing;
```

```ts
// secret.js|ts
import { SlashCommand } from "djs-marshal";

const secret: SlashCommand = {
  name: 'secret',
  description: 'Only for server moderators',
  // this command is registered in all the
  // guilds the bot is in
  commandType: 'allGuild',
  // this disables the command for anyone who
  // doesn't have any of these permissions
  allowWithPermission: ['MANAGE_SERVER'],
  async execute (command) {
    command.reply('Secret moderators stuff')
  }
};

export default secret;
```

## Contributing

Please read CONTRIBUTING.md for the guidelines to contribute to this project.