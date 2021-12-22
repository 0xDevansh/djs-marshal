/**
 * Finds and executes a slash command
 *
 * @param {CommandInteraction} int The incoming CommandInteraction
 * @param {Client} client The client where the commands are stored
 * @param {string | undefined} guildId The guildId, if command is from a guild
 */
export const handleSlashCommand = async (int: CommandInteraction, client: Client, guildId?: string): Promise<void> => {
  let foundCommand = client.commands.get('global')?.find((c) => c.name === int.commandName);
  if (!foundCommand && guildId) foundCommand = client.commands.get(guildId)?.find((c) => c.name === int.commandName);
  // defer
  if (foundCommand?.beforeExecute?.deferEphemeral) await int.deferReply({ ephemeral: true });
  else if (foundCommand?.beforeExecute?.defer) await int.deferReply();
  // finally, execute command
  foundCommand?.execute(int);
};

import { Client, CommandInteraction } from 'discord.js';
