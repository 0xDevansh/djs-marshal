import { Client, Collection, Snowflake } from 'discord.js';
import { MarshalOptions } from '../structures/MarshalOptions';
import { handleInteraction } from './handlers/handleInteraction';
import { loadCommandsFromDir } from './commands/loadCommandsFromDir';
import { handleGuildJoin } from './handlers/handleGuildJoin';
import { loadButtonsFromDir } from './buttons/loadButtonsFromDir';
import { loadSelectMenusFromDir } from './selectMenus/loadSelectMenusFromDir';
import { SlashCommand } from '../structures/SlashCommand';
import { ButtonCommand } from '../structures/ButtonCommand';
import { SelectMenuCommand } from '../structures/SelectMenuCommand';
import { syncGuildCommands } from './commands/syncCommands';
import chalk from 'chalk';

/**
 * Create and set up a bot for slash commands
 *
 * @param options Options for creating the bot
 *
 * @remark Intents need to be specified for creating the client
 */
export const initializeBot = (options: MarshalOptions): Client => {
  const client = new Client(options);

  // logging stuff
  (client.logMethod =
    options.logMethod ||
    function (message, level): void {
      let header = 'djs-marshal';
      switch (level) {
        case 'verbose':
          header = chalk.bgGray(header);
          break;
        case 'warn':
          header = chalk.bgYellow(header);
          break;
        case 'erroronly':
          header = chalk.bgRed(header);
          break;
      }
      console.log(`${header} ${message}`);
    }),
    (client.commands = new Collection<Snowflake | 'global' | 'allGuild', Array<SlashCommand>>());
  client.buttons = new Collection<string | RegExp, ButtonCommand>();
  client.selectMenus = new Collection<string | RegExp, SelectMenuCommand>();

  // handle all sorts of interactions
  client.on('interactionCreate', handleInteraction);

  client.on('guildCreate', handleGuildJoin);

  client.on('ready', () => {
    // load commands, buttons and select menus
    if (options.slashCommandsPath) void loadCommandsFromDir(client, options.slashCommandsPath);
    if (options.buttonsPath) void loadButtonsFromDir(client, options.buttonsPath);
    if (options.selectMenusPath) void loadSelectMenusFromDir(client, options.selectMenusPath);

    // log readyMessage
    if (options.readyMessage) {
      const message = options.readyMessage
        .replace('{username}', client.user?.username || 'Username not found')
        .replace('{tag}', client.user?.tag || 'User tag not found');
      console.log(message);
    }
  });

  client.on('guildUpdate', (newGuild) => syncGuildCommands(newGuild));

  if (options.token) void client.login(options.token);
  return client;
};
