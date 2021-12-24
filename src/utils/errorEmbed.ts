import { MessageEmbed } from 'discord.js';

/**
 * Returns a red-coloured embed meant for errors
 *
 * @param error The main error text
 * @param description Additional information regarding the error
 *
 * @return {MessageEmbed} The embed
 */
export const errorEmbed = (error: string, description?: string): MessageEmbed => {
  return new MessageEmbed({
    title: error,
    description,
    color: 'RED',
  });
};
