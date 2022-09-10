import { SlashCommand } from '../../structures/SlashCommand';
import { Client, Collection, Snowflake, ApplicationCommandType } from 'discord.js';
import { syncCommands } from './syncCommands';

/**
 * Loads slash commands and stores them as client.commands, then syncs them with Discord
 *
 * @param {Client} client The bot's Client
 * @param {SlashCommand[]} commands An array of SlashCommands to load
 */
export const loadCommands = async (client: Client, commands: SlashCommand[]): Promise<void> => {
  const commandsCollection = new Collection<Snowflake | 'global' | 'allGuild', Array<SlashCommand>>();

  commandsCollection.set('global', []);
  commandsCollection.set('allGuild', []);

  client.logMethod('Loading commands', 'verbose');
  commands.forEach((command) => {
    // preload checks
    if (command.beforeExecute?.defer && command.beforeExecute?.deferEphemeral)
      client.logMethod(`defer and deferEphemeral are both true for command ${command.name}`, 'erroronly');

    if (!command.type) command.type = ApplicationCommandType.ChatInput;
    if (command.handleError === undefined) command.handleError = true;

    // is guild command
    if (command.commandType === 'guild' && command.guildId) {
      if (commandsCollection.get(command.guildId)) {
        commandsCollection.get(command.guildId)?.push(command);
      } else commandsCollection.set(command.guildId, [command]);
    } else if (command.commandType === 'allGuild') {
      commandsCollection.get('allGuild')?.push(command);
    } else {
      commandsCollection.get('global')?.push(command);
    }
  });

  client.commands = commandsCollection;
  client.logMethod('Loaded all commands', 'verbose');
  await syncCommands(client).catch((err) => client.logMethod(err, 'erroronly'));
};
