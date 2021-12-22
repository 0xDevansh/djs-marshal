import { SlashCommand } from '../../structures/SlashCommand';
import { Client, Collection, Snowflake } from 'discord.js';
import { syncCommands } from './syncCommands';
import { logWarning, logVerbose, logError } from '../../utils/logger';

/**
 * Loads slash commands and stores them as client.commands, then syncs them with Discord
 *
 * @param {Client} client The bot's Client
 * @param {SlashCommand[]} commands An array of SlashCommands to load
 */
export const loadCommands = async (client: Client, commands: SlashCommand[]): Promise<void> => {
  const commandsCollection = new Collection<Snowflake | 'global', Array<SlashCommand>>();

  commandsCollection.set('global', []);
  commands.forEach((command) => {
    // preload checks
    if (command.defer && command.deferEphemeral)
      logWarning(`defer and deferEphemeral are both true for command ${command.name}`, client);
    // is guild command
    if ('guildId' in command && command.guildId) {
      if (commandsCollection.get(command.guildId)) commandsCollection.get(command.guildId)?.push(command);
      else commandsCollection.set(command.guildId, [command]);
      console.log(`Loaded command ${command.name}`);
      return;
    }
    // is global command
    commandsCollection.get('global')?.push(command);

    logVerbose(`Loaded command ${command.name}`, client);
  });

  client.commands = commandsCollection;
  await syncCommands(client).catch((err) => logError(err, client));
};
