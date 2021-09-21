import { Interaction } from 'discord.js';
import { handleSlashCommand } from './handleSlashCommand';

export const handleInteraction = (int: Interaction) => {
  if (int.isCommand()) handleSlashCommand(int);
};
