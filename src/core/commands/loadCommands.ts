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
  const commandsCollection = new Collection<Snowflake | 'global' | 'allGuild', Array<SlashCommand>>();

  commandsCollection.set('global', []);
  commandsCollection.set('allGuild', []);

  commands.forEach((command) => {
    // preload checks
    if (command.beforeExecute?.defer && command.beforeExecute?.deferEphemeral)
      logWarning(`defer and deferEphemeral are both true for command ${command.name}`, client);
    if ('allowWithPermission' in command && command.allowWithPermission === [])
      logWarning(`allowWithPermission is [] for ${command.name}, it will be ignored`, client);

    if (!command.type) command.type = 'CHAT_INPUT';
    if (!command.defaultPermission) command.defaultPermission = true;
    if (command.handleError === undefined) command.handleError = true;
    if ('allowWithPermission' in command) command.defaultPermission = !command.allowWithPermission?.length;

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

    logVerbose(`Loaded command ${command.name}`, client);
  });

  client.commands = commandsCollection;
  await syncCommands(client).catch((err) => logError(err, client));
};
