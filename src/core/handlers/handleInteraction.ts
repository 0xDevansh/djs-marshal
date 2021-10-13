import { CommandInteraction, Interaction } from 'discord.js';
import { handleSlashCommand } from './handleSlashCommand';

export const handleInteraction = (int: Interaction): void => {
  if (int.isCommand()) handleSlashCommand(<CommandInteraction>int, int.client, int.guildId ?? undefined);
};
