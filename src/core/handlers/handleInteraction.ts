import { CommandInteraction, Interaction } from 'discord.js';
import { handleSlashCommand } from './handleSlashCommand';

/**
 * Check incoming interactions and execute slash commands if any
 * @param int The incoming interaction
 */
export const handleInteraction = (int: Interaction): void => {
  if (int.isCommand()) handleSlashCommand(<CommandInteraction>int, int.client, int.guildId ?? undefined);
};
