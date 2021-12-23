import { MessageEmbed } from 'discord.js';

/**
 * Returns a red-coloured embed meant for errors
 *
 * @param message The main message
 * @param description Additional information regarding the message
 *
 * @return {MessageEmbed} The embed
 */
export const successEmbed = (message: string, description?: string): MessageEmbed => {
  return new MessageEmbed({
    title: message,
    description,
    color: 'RED',
  });
};
