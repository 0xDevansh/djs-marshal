import { Client, CommandInteraction } from 'discord.js';

export const handleSlashCommand = (int: CommandInteraction, client: Client, guildId?: string) => {
  let foundCommand = client.commands.get('global')?.find((c) => c.name === int.commandName);
  if (!foundCommand && guildId) foundCommand = client.commands.get(guildId)?.find((c) => c.name === int.commandName);
  else return;

  foundCommand.execute(int);
};
