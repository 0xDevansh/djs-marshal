import { Client, Collection, Snowflake } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';

/**
 * Sync the slash commands with Discord
 * @param commands The commands to sync
 * @param client The bot's client
 */
export const syncCommands = async (
  commands: Collection<Snowflake | 'global', Array<SlashCommand>>,
  client: Client,
): Promise<void> => {
  if (client.application?.partial) await client.application?.fetch();
  // sync global commands
  const global = commands.get('global');
  if (global !== undefined) await client.application?.commands.set(global);
  // sync guild commands
  for (const [guildId, guildCommands] of commands) {
    if (guildId === 'global') return;
    await client.application?.commands.set(guildCommands, guildId);
  }
  console.log('synced commands with Discord');
};
