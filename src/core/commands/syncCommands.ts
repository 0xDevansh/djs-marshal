import { ApplicationCommand, Client, Collection, GuildResolvable } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import deepEqual from 'deep-equal';
import { logVerbose } from '../logging/logger';

const syncGlobalCommands = async (
  client: Client,
  currentCommands: Collection<string, ApplicationCommand<{ guild: GuildResolvable }>> | undefined,
  newCommands: SlashCommand[],
) => {
  if (!currentCommands) return;

  for (const command of newCommands) {
    if (!command.options?.length) command.options = [];

    const matching = currentCommands.find((c) => c.name === command.name);
    if (!matching) {
      logVerbose(`Found new global command: ${command.name}, syncing...`, client.logLevel);
      await client.application?.commands.create(command);
      continue;
    }
    if (matching.description !== command.description || !deepEqual(matching.options, command.options)) {
      logVerbose(`Found changes in global command ${command.name}, syncing...`, client.logLevel);
      await client.application?.commands.create(command);
    }
  }
};

/**
 * Syncs the slash commands with Discord
 *
 * @param client The bot's client
 */
export const syncCommands = async (client: Client): Promise<void> => {
  const commands = client.commands;
  if (client.application?.partial) await client.application?.fetch();

  // sync global commands
  const global = commands.get('global');
  const current = await client.application?.commands.fetch();
  if (global) await syncGlobalCommands(client, current, global);

  // sync guild commands
  for (const [guildId, guildCommands] of commands) {
    if (guildId === 'global') continue;
    await client.application?.commands.set(guildCommands, guildId);
  }
  logVerbose('Successfully synced guild commands', client.logLevel);
};
