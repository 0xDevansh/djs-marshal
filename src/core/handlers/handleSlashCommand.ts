export const handleSlashCommand = (int: CommandInteraction, client: Client, guildId?: string): void => {
  let foundCommand = client.commands.get('global')?.find((c) => c.name === int.commandName);
  if (!foundCommand && guildId) foundCommand = client.commands.get(guildId)?.find((c) => c.name === int.commandName);

  foundCommand?.execute(int);
};

import { Client, CommandInteraction } from 'discord.js';
