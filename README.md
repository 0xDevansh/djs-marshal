
# djs-marshal

A lightweight command handler for discord.js interactions

> This package requires discord.js v13 or higher to be installed

#### This package is currently under construction, more features will be added regularly. The docs are also pretty barebones at the moment and will be improved soon.

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

// you can pass in the token to make the client login automatically
const client = Marshal.initializeBot({
  intents: [Intents.FLAGS.GUILDS],
  token: 'your-token-here',
  // this is the folder path that contains your commands
  slashCommandsPath: path.join(__dirname, 'commands')
});
```

Now in your commands folder, you can start creating command files!

Here are some examples:

```ts
// ping.js|ts
import { SlashCommand } from "djs-marshal";

// a pretty basic command. command is a discord.js
// CommandInteraction and you can use its methods like
// reply, defer, editReply, etc.
export default {
  name: 'ping',
  description: 'Play ping-pong with me',
  execute (command) {
    command.reply('Pong!')
  }
} as SlashCommand;
```

```ts
// guildPing.js|ts
import { SlashCommand } from "djs-marshal";

// any command with a guildId specified is registered as
// as a guild command and will only work in that guild
export default {
  name: 'guildping',
  description: 'Play ping-pong with me in this server',
  guildId: '873232757508157470',
  execute (command) {
    command.reply('Peng!');
  }
} as SlashCommand;
```

```ts
// deferredPing.js|ts
import { SlashCommand } from "djs-marshal";

// you can pass in defer as true to defer the interaction beforehand
export default {
  name: 'slothping',
  description: 'piiiiiinnnnnng',
  // you can also use deferEphemeral to mark the reply ephemeral
  defer: true,
  execute (command) {
    setInterval(() =>{
      command.editReply('Pooooooonnnngg!');
    }, 3000)
  }
} as SlashCommand;
```

## Contributing

Please read CONTRIBUTING.md for the guidelines to contribute to this project