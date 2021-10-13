export const handleSlashCommand = async (int: CommandInteraction, client: Client, guildId?: string): Promise<void> => {
  let foundCommand = client.commands.get('global')?.find((c) => c.name === int.commandName);
  if (!foundCommand && guildId) foundCommand = client.commands.get(guildId)?.find((c) => c.name === int.commandName);
  // defer
  if (foundCommand?.deferEphemeral) await int.deferReply({ ephemeral: true });
  else if (foundCommand?.defer) await int.deferReply();
  // finally, execute command
  foundCommand?.execute(int);
};

import { Client, CommandInteraction } from 'discord.js';
