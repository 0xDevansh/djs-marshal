import { Client, Collection, Snowflake } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';

/**
 * Sync the slash commands with Discord
 * @param commands The commands to sync
 * @param client The bot's client
 */
export const syncCommands = async (commands: Collection<Snowflake | 'global', Array<SlashCommand>>, client: Client) => {
  if (!client.application?.partial) await client.application?.fetch();
  // sync global commands
  const global = commands.get('global');
  if (global?.length) await client.application?.commands.set(global);
  // sync guild commands
  for (let [guildId, guildCommands] of commands) {
    if (!guildCommands.length) return;
    await client.application?.commands.set(guildCommands, guildId);
  }
};
