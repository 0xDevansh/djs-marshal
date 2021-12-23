import { SlashCommand } from '../structures/SlashCommand';
import { ApplicationCommand, ApplicationCommandData } from 'discord.js';

/**
 * Convert SlashCommand or ApplicationCommand to ApplicationCommandData
 * @param command The command to convert
 */
export const toApplicationCommand = (command: SlashCommand | ApplicationCommand): ApplicationCommandData => {
  return {
    name: command.name,
    description: command.description,
    type: command.type,
    options: command.options,
    defaultPermission: command.defaultPermission,
  };
};
