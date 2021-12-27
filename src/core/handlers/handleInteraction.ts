import { CommandInteraction, Interaction } from 'discord.js';
import { handleSlashCommand } from './handleSlashCommand';
import { handleButtonInteraction } from './handleButtonInteraction';

/**
 * Checks incoming interactions and executes slash commands if any
 *
 * @param {Interaction} int The incoming interaction
 */
export const handleInteraction = async (int: Interaction): Promise<void> => {
  if (int.isCommand()) {
    await handleSlashCommand(<CommandInteraction>int, int.client, int.guildId ?? undefined);
  } else if (int.isButton()) {
    await handleButtonInteraction(int);
  }
};
