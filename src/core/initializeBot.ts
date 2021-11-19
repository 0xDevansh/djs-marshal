import { Client } from 'discord.js';
import { MarshalOptions } from '../structures/MarshalOptions';
import { handleInteraction } from './handlers/handleInteraction';
import { loadCommandsFromDir } from './commands/loadCommandsFromDir';

/**
 * Create and setup a bot for slash commands
 *
 * @param options Options for creating the bot
 *
 * @remark Intents need to be specified for creating the client
 */
export const initializeBot = (options: MarshalOptions): Client => {
  const client = new Client(options);

  client.on('interactionCreate', handleInteraction);

  if (options.slashCommandsPath || options.readyMessage)
    client.on('ready', () => {
      if (options.readyMessage) {
        const logMessage = options.readyMessage
          .replace('{username}', client.user?.username || 'Username not found')
          .replace('{tag}', client.user?.tag || 'User tag not found');
        console.log(logMessage);
      }
      if (options.slashCommandsPath) loadCommandsFromDir(client, options.slashCommandsPath);
    });

  if (options.token) client.login(options.token);

  client.logLevel = options.logLevel || 'warn';
  return client;
};
