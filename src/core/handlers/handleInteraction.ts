import { CommandInteraction, Interaction, InteractionType } from 'discord.js';
import { handleSlashCommand } from './handleSlashCommand';
import { handleButtonInteraction } from './handleButtonInteraction';
import { handleSelectMenuInteraction } from './handleSelectMenuInteraction';

/**
 * Checks incoming interactions and executes slash commands if any
 *
 * @param {Interaction} int The incoming interaction
 */
export const handleInteraction = async (int: Interaction): Promise<void> => {
  if (int.type === InteractionType.ApplicationCommand) {
    await handleSlashCommand(<CommandInteraction>int, int.client, int.guildId ?? undefined);
  } else if (int.isButton()) {
    await handleButtonInteraction(int);
  } else if (int.isSelectMenu()) {
    await handleSelectMenuInteraction(int);
  }
};
