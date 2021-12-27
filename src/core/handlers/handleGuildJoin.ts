import { Guild } from 'discord.js';

/**
 * Registers commands in a guild when joined
 *
 * @param {Guild} guild The Guild joined
 */
export const handleGuildJoin = (guild: Guild): void => {
  const commands = (guild.client.commands.get(guild.id) || []).concat(guild.client.commands.get('allGuild') || []);
  void guild.commands.set(commands);
};
