import { SlashCommand } from '../../structures/SlashCommand';
import { Client, Collection, Snowflake } from 'discord.js';
import { syncCommands } from './syncCommands';

/**
 * Load SlashCommands and store them as client.commands
 * @param client The bot's Client
 * @param commands The array of SlashCommands to load
 */
export const loadCommands = (client: Client, commands: Array<SlashCommand>) => {
  const commandsCollection = new Collection<Snowflake | 'global', Array<SlashCommand>>();

  commandsCollection.set('global', []);
  commands.forEach((command) => {
    // is guild command
    if ('guildId' in command && command.guildId) {
      if (commandsCollection.get(command.guildId)) commandsCollection.get(command.guildId)?.push(command);
      else commandsCollection.set(command.guildId, [command]);
      console.log(`Loaded command ${command.name}`);
      return;
    }
    // is global command
    commandsCollection.get('global')?.push(command);
    console.log(`Loaded command ${command.name}`);
  });

  client.commands = commandsCollection;
  syncCommands(client.commands, client);
};
