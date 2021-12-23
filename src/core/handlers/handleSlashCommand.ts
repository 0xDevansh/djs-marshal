/**
 * Finds and executes a slash command
 *
 * @param {CommandInteraction} int The incoming CommandInteraction
 * @param {Client} client The client where the commands are stored
 * @param {string | undefined} guildId The guildId, if command is from a guild
 */
import { logWarning } from '../../utils/logger';

export const handleSlashCommand = async (int: CommandInteraction, client: Client, guildId?: string): Promise<void> => {
  // find command
  let foundCommand = (client.commands.get('global') || [])
    .concat(client.commands.get('allGuild') || [])
    .find((c) => c.name === int.commandName);
  if (!foundCommand && guildId) foundCommand = client.commands.get(guildId)?.find((c) => c.name === int.commandName);
  if (!foundCommand) return logWarning(`Received interaction named ${int.commandName} but command not found`, client);

  // defer
  if (foundCommand.beforeExecute?.deferEphemeral) await int.deferReply({ ephemeral: true });
  else if (foundCommand.beforeExecute?.defer) await int.deferReply();
  // finally, execute command
  foundCommand.execute(int);
};

import { Client, CommandInteraction } from 'discord.js';
