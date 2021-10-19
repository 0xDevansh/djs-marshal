import { SlashCommand } from '../../structures/SlashCommand';
import { Client, Collection, Snowflake } from 'discord.js';
import { syncCommands } from './syncCommands';
import { logWarning, logVerbose, logError } from '../logging/logger';

/**
 * Load slash commands and store them as client.commands
 * @param client The bot's Client
 * @param commands The array of SlashCommands to load
 */
export const loadCommands = (client: Client, commands: Array<SlashCommand>): void => {
  const commandsCollection = new Collection<Snowflake | 'global', Array<SlashCommand>>();

  commandsCollection.set('global', []);
  commands.forEach((command) => {
    // pre-load checks
    if (command.defer && command.deferEphemeral)
      logWarning(`defer and deferEphemeral are both true for command ${command.name}`, client.logLevel);
    // is guild command
    if ('guildId' in command && command.guildId) {
      if (commandsCollection.get(command.guildId)) commandsCollection.get(command.guildId)?.push(command);
      else commandsCollection.set(command.guildId, [command]);
      console.log(`Loaded command ${command.name}`);
      return;
    }
    // is global command
    commandsCollection.get('global')?.push(command);

    logVerbose(`Loaded command ${command.name}`, client.logLevel);
  });

  client.commands = commandsCollection;
  syncCommands(client.commands, client).catch(logError);
};
