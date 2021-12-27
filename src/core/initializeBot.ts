import { Client } from 'discord.js';
import { MarshalOptions } from '../structures/MarshalOptions';
import { handleInteraction } from './handlers/handleInteraction';
import { loadCommandsFromDir } from './commands/loadCommandsFromDir';
import { handleGuildJoin } from './handlers/handleGuildJoin';
import { handleGuildMemberUpdate } from './handlers/handleGuildMemberUpdate';

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
  client.logLevel = options.logLevel || 'warn';
  client.logStyle = options.logStyle || 'simple';
  client.logMethod = options.logMethod;

  // load commands
  if (options.slashCommandsPath)
    loadCommandsFromDir(client, options.slashCommandsPath).catch((err) => {
      throw err;
    });

  // handle all sorts of interactions
  client.on('interactionCreate', handleInteraction);

  client.on('guildCreate', handleGuildJoin);
  client.on('guildMemberUpdate', handleGuildMemberUpdate);

  if (options.readyMessage) {
    const message = options.readyMessage
      .replace('{username}', client.user?.username || 'Username not found')
      .replace('{tag}', client.user?.tag || 'User tag not found');

    client.once('ready', () => console.log(message));
  }

  if (options.token) void client.login(options.token);
  return client;
};
