import { Client } from 'discord.js';
import { MarshalOptions } from '../structures/MarshalOptions';
import { handleInteraction } from './handlers/handleInteraction';
import { loadCommandsFromDir } from './commands/loadCommandsFromDir';

/**
 * Create and set up a bot for slash commands
 * @param options Options for creating the bot
 */
export const initializeBot = (options: MarshalOptions): Client => {
  const client = new Client(options);

  client.logLevel = options.logLevel || 'warn';
  client.logStyle = options.logStyle || 'simple';

  client.on('interactionCreate', handleInteraction);

  if (options.slashCommandsPath || options.readyMessage)
    client.on('ready', () => {
      if (options.readyMessage) {
        const logMessage = options.readyMessage
          .replace('{username}', client.user?.username || 'Username not found')
          .replace('{tag}', client.user?.tag || 'User tag not found');
        console.log(logMessage);
      }
      if (options.slashCommandsPath)
        loadCommandsFromDir(client, options.slashCommandsPath).catch((err) => {
          throw err;
        });
    });

  if (options.token) void client.login(options.token);
  return client;
};
